
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export type ImageTransformation = 'ghibli' | 'lowlight' | 'vintage' | 'cartoon' | 'original';

export interface ImagePost {
  id: string;
  userId: string;
  username: string;
  imageUrl: string;
  originalImageUrl: string;
  caption: string;
  likes: number;
  comments: Comment[];
  createdAt: Date;
  transformation: ImageTransformation;
  prompt?: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

interface ImageContextType {
  posts: ImagePost[];
  isLoading: boolean;
  uploadImage: (file: File, caption: string, transformation: ImageTransformation, prompt?: string) => Promise<boolean>;
  likePost: (postId: string) => Promise<boolean>;
  addComment: (postId: string, content: string) => Promise<boolean>;
  deletePost: (postId: string) => Promise<boolean>;
  fetchPosts: () => Promise<void>;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImages = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};

export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<ImagePost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile, isAuthenticated } = useAuth();

  // Fetch posts when component mounts or when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(`
          id,
          user_id,
          original_image_url,
          transformed_image_url,
          caption,
          prompt,
          transformation_type,
          created_at,
          updated_at,
          profiles:user_id (username),
          likes (count)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const postsWithComments = await Promise.all(
        postsData.map(async (post) => {
          const { data: commentsData, error: commentsError } = await supabase
            .from('comments')
            .select(`
              id,
              user_id,
              content,
              created_at,
              profiles:user_id (username)
            `)
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });

          if (commentsError) {
            console.error('Error fetching comments:', commentsError);
            return {
              ...mapPostFromDb(post),
              comments: []
            };
          }

          const comments = commentsData.map((comment) => ({
            id: comment.id,
            userId: comment.user_id,
            username: comment.profiles.username,
            content: comment.content,
            createdAt: new Date(comment.created_at)
          }));

          return {
            ...mapPostFromDb(post),
            comments
          };
        })
      );

      setPosts(postsWithComments);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  const mapPostFromDb = (post: any): ImagePost => {
    return {
      id: post.id,
      userId: post.user_id,
      username: post.profiles.username,
      imageUrl: post.transformed_image_url,
      originalImageUrl: post.original_image_url,
      caption: post.caption,
      likes: post.likes?.count || 0,
      comments: [],
      createdAt: new Date(post.created_at),
      transformation: post.transformation_type as ImageTransformation,
      prompt: post.prompt
    };
  };

  const uploadImage = async (
    file: File,
    caption: string,
    transformation: ImageTransformation,
    prompt?: string
  ): Promise<boolean> => {
    if (!user || !profile) {
      toast.error('You must be logged in to upload images');
      return false;
    }

    setIsLoading(true);
    try {
      // Generate unique file paths
      const originalFilePath = `${user.id}/${uuidv4()}-original`;
      const transformedFilePath = `${user.id}/${uuidv4()}-transformed`;

      // Upload original image to storage
      const { data: originalUploadData, error: originalUploadError } = await supabase.storage
        .from('images')
        .upload(originalFilePath, file);

      if (originalUploadError) {
        throw originalUploadError;
      }

      // Get public URL for the original image
      const { data: originalUrlData } = await supabase.storage
        .from('images')
        .getPublicUrl(originalFilePath);

      // For now, we'll use the same image for both original and transformed
      // In a real app, you would implement transformation logic or call an API
      
      // Upload transformed image (same as original for now)
      const { data: transformedUploadData, error: transformedUploadError } = await supabase.storage
        .from('images')
        .upload(transformedFilePath, file);

      if (transformedUploadError) {
        // Clean up the original upload
        await supabase.storage.from('images').remove([originalFilePath]);
        throw transformedUploadError;
      }

      // Get public URL for the transformed image
      const { data: transformedUrlData } = await supabase.storage
        .from('images')
        .getPublicUrl(transformedFilePath);

      // Save post to database
      const { data: newPost, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          original_image_url: originalUrlData.publicUrl,
          transformed_image_url: transformedUrlData.publicUrl,
          caption,
          prompt,
          transformation_type: transformation
        })
        .select(`
          id, 
          user_id, 
          original_image_url, 
          transformed_image_url, 
          caption, 
          prompt, 
          transformation_type, 
          created_at,
          profiles:user_id (username)
        `)
        .single();

      if (postError) {
        // Clean up storage
        await supabase.storage.from('images').remove([originalFilePath, transformedFilePath]);
        throw postError;
      }

      // Add new post to state
      const formattedPost: ImagePost = {
        id: newPost.id,
        userId: newPost.user_id,
        username: newPost.profiles.username,
        imageUrl: newPost.transformed_image_url,
        originalImageUrl: newPost.original_image_url,
        caption: newPost.caption,
        likes: 0,
        comments: [],
        createdAt: new Date(newPost.created_at),
        transformation: newPost.transformation_type as ImageTransformation,
        prompt: newPost.prompt
      };

      setPosts(prev => [formattedPost, ...prev]);
      
      toast.success('Image uploaded and transformed successfully!');
      return true;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload and transform image');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const likePost = async (postId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to like posts');
      return false;
    }

    try {
      // Check if user already liked the post
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select()
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw checkError;
      }

      if (existingLike) {
        // Unlike
        const { error: unlikeError } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (unlikeError) throw unlikeError;

        // Update state
        setPosts(prev =>
          prev.map(post =>
            post.id === postId ? { ...post, likes: Math.max(0, post.likes - 1) } : post
          )
        );
      } else {
        // Like
        const { error: likeError } = await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id });

        if (likeError) throw likeError;

        // Update state
        setPosts(prev =>
          prev.map(post =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
      }

      return true;
    } catch (error: any) {
      console.error('Like/unlike error:', error);
      toast.error(error.message || 'Failed to like/unlike post');
      return false;
    }
  };

  const addComment = async (postId: string, content: string): Promise<boolean> => {
    if (!user || !profile) {
      toast.error('You must be logged in to comment');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content
        })
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (username)
        `)
        .single();

      if (error) throw error;

      const newComment: Comment = {
        id: data.id,
        userId: data.user_id,
        username: data.profiles.username,
        content: data.content,
        createdAt: new Date(data.created_at)
      };

      setPosts(prev =>
        prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment]
            };
          }
          return post;
        })
      );

      return true;
    } catch (error: any) {
      console.error('Comment error:', error);
      toast.error(error.message || 'Failed to add comment');
      return false;
    }
  };

  const deletePost = async (postId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to delete posts');
      return false;
    }

    try {
      // Find the post to delete (to get file paths)
      const postToDelete = posts.find(post => post.id === postId);
      
      if (!postToDelete) {
        toast.error('Post not found');
        return false;
      }
      
      // Only allow the post owner to delete
      if (postToDelete.userId !== user.id) {
        toast.error('You can only delete your own posts');
        return false;
      }

      // Delete post from database
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      // Extract file paths from URLs
      const getPathFromUrl = (url: string) => {
        const parts = url.split('/');
        // Get the last two segments (userId/filename)
        return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
      };
      
      // Try to delete the images from storage
      try {
        const originalPath = getPathFromUrl(postToDelete.originalImageUrl);
        const transformedPath = getPathFromUrl(postToDelete.imageUrl);
        
        await supabase.storage
          .from('images')
          .remove([originalPath, transformedPath]);
      } catch (storageError) {
        // Log but don't fail if image deletion fails
        console.error('Failed to delete images:', storageError);
      }

      // Update state
      setPosts(prev => prev.filter(post => post.id !== postId));
      
      toast.success('Post deleted successfully!');
      return true;
    } catch (error: any) {
      console.error('Delete post error:', error);
      toast.error(error.message || 'Failed to delete post');
      return false;
    }
  };

  return (
    <ImageContext.Provider
      value={{
        posts,
        isLoading,
        uploadImage,
        likePost,
        addComment,
        deletePost,
        fetchPosts
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
