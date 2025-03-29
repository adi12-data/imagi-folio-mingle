
import React, { useState } from 'react';
import { ImagePost as ImagePostType } from '@/contexts/ImageContext';
import { useImages } from '@/contexts/ImageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, Share2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ImagePostProps {
  post: ImagePostType;
}

const ImagePost: React.FC<ImagePostProps> = ({ post }) => {
  const { likePost, addComment, deletePost } = useImages();
  const { user, isAuthenticated } = useAuth();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  
  const handleLike = () => {
    likePost(post.id);
  };
  
  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && user) {
      addComment(post.id, user.id, user.username, comment);
      setComment('');
    }
  };

  const isOwnPost = user?.id === post.userId;

  const transformationLabels = {
    ghibli: 'Ghibli Style',
    lowlight: 'Low Light Enhanced',
    vintage: 'Vintage',
    cartoon: 'Cartoon',
    original: 'Original'
  };

  return (
    <Card className="overflow-hidden card-hover">
      <CardHeader className="p-4 space-y-0 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt={post.username} />
            <AvatarFallback>{post.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.username}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <Badge variant="outline">{transformationLabels[post.transformation]}</Badge>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative aspect-square bg-muted">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-4">
          <p className="text-sm">{post.caption}</p>
          {post.prompt && (
            <div className="mt-2 text-xs bg-muted p-2 rounded-md">
              <span className="font-medium">Prompt:</span> {post.prompt}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={handleLike} disabled={!isAuthenticated}>
              <Heart className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium">{post.likes}</span>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowComments(!showComments)} 
              className="ml-2"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium">{post.comments.length}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {isOwnPost && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => deletePost(post.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {showComments && (
          <div className="mt-4 w-full">
            {post.comments.length > 0 ? (
              <div className="space-y-3 max-h-36 overflow-y-auto pr-2">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{comment.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="bg-muted rounded-md p-2">
                        <p className="text-xs font-medium">{comment.username}</p>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-2">No comments yet</p>
            )}
            
            {isAuthenticated ? (
              <form onSubmit={handleComment} className="mt-3 flex items-center">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow text-sm px-3 py-2 bg-muted rounded-l-md border-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
                <Button 
                  type="submit" 
                  variant="default"
                  size="sm" 
                  disabled={!comment.trim()}
                  className="rounded-l-none"
                >
                  Post
                </Button>
              </form>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                <a href="/login" className="text-primary hover:underline">Log in</a> to comment
              </p>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ImagePost;
