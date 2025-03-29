
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useImages } from '@/contexts/ImageContext';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import ImagePost from '@/components/image/ImagePost';
import { Camera } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { posts } = useImages();
  
  const userPosts = posts.filter((post) => post.userId === user?.id);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user?.profileImageUrl} />
            <AvatarFallback className="text-2xl">{user?.username?.[0]}</AvatarFallback>
          </Avatar>
          
          <h1 className="text-2xl font-bold">{user?.username}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
          
          <div className="flex gap-4 mt-4">
            <Button variant="outline" size="sm">Edit Profile</Button>
          </div>
        </div>
        
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            {userPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPosts.map((post) => (
                  <ImagePost key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No posts yet</h3>
                  <p className="text-muted-foreground text-center max-w-xs mt-1 mb-4">
                    When you create posts, they will appear here on your profile.
                  </p>
                  <Button asChild>
                    <a href="/create">Create Your First Post</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-medium">Saved posts</h3>
                <p className="text-muted-foreground text-center max-w-xs mt-1">
                  This feature is coming soon! You'll be able to save your favorite transformations.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
