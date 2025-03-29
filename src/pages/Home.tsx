
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useImages } from '@/contexts/ImageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import ImagePost from '@/components/image/ImagePost';
import HeroSection from '@/components/sections/HeroSection';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { posts } = useImages();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {!isAuthenticated && <HeroSection />}
        
        <div className="container py-8">
          <h2 className="text-2xl font-bold mb-6">
            {isAuthenticated ? "Your Feed" : "Recent Transformations"}
          </h2>
          
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <ImagePost key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6">
                {isAuthenticated 
                  ? "Start by creating your first transformation"
                  : "Be the first to share a transformed image"}
              </p>
              <Button asChild>
                <Link to={isAuthenticated ? "/create" : "/signup"}>
                  {isAuthenticated ? "Create New Post" : "Sign Up to Post"}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} ImagiFolio. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/about" className="text-sm text-muted-foreground hover:underline">
              About
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
