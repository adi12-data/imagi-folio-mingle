
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from 'sonner';

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
  uploadImage: (file: File, caption: string, transformation: ImageTransformation, prompt?: string) => Promise<boolean>;
  likePost: (postId: string) => void;
  addComment: (postId: string, userId: string, username: string, content: string) => void;
  deletePost: (postId: string) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImages = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};

// Mock data for initial posts
const mockPosts: ImagePost[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'artlover',
    imageUrl: '/placeholder.svg',
    originalImageUrl: '/placeholder.svg',
    caption: 'Transformed into Ghibli style!',
    likes: 42,
    comments: [
      {
        id: 'c1',
        userId: 'user2',
        username: 'designfan',
        content: 'This looks amazing! What prompt did you use?',
        createdAt: new Date('2023-06-15T10:32:00'),
      }
    ],
    createdAt: new Date('2023-06-15T09:24:00'),
    transformation: 'ghibli',
    prompt: 'Transform to Ghibli style with magical forest elements',
  },
  {
    id: '2',
    userId: 'user3',
    username: 'photomagic',
    imageUrl: '/placeholder.svg',
    originalImageUrl: '/placeholder.svg',
    caption: 'Low light enhancement magic',
    likes: 28,
    comments: [],
    createdAt: new Date('2023-06-14T16:45:00'),
    transformation: 'lowlight',
  }
];

export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<ImagePost[]>(mockPosts);

  // Mock function to simulate image upload and transformation
  const uploadImage = async (
    file: File,
    caption: string,
    transformation: ImageTransformation,
    prompt?: string
  ): Promise<boolean> => {
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create file URL (in a real app, this would be uploaded to a server)
      const imageUrl = URL.createObjectURL(file);
      
      // Create new post
      const newPost: ImagePost = {
        id: `post-${Date.now()}`,
        userId: 'current-user', // This would come from the auth context in a real app
        username: 'me', // This would come from the auth context in a real app
        imageUrl: imageUrl, // In a real app, this would be the transformed image URL
        originalImageUrl: imageUrl,
        caption,
        likes: 0,
        comments: [],
        createdAt: new Date(),
        transformation,
        prompt,
      };
      
      // Add new post to the beginning of the array
      setPosts(prev => [newPost, ...prev]);
      
      toast.success('Image uploaded and transformed successfully!');
      return true;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload and transform image.');
      return false;
    }
  };

  const likePost = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const addComment = (postId: string, userId: string, username: string, content: string) => {
    setPosts(prev => 
      prev.map(post => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: `comment-${Date.now()}`,
            userId,
            username,
            content,
            createdAt: new Date(),
          };
          
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    toast.success('Post deleted successfully!');
  };

  return (
    <ImageContext.Provider
      value={{
        posts,
        uploadImage,
        likePost,
        addComment,
        deletePost,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
