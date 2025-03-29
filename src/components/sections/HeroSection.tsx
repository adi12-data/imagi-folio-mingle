
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="py-20 px-4 md:px-6 bg-gradient-to-b from-secondary/10 to-background">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Transform Your Images with <span className="text-gradient">AI Magic</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            Turn ordinary photos into extraordinary art using prompt-based transformations. 
            Enhance low-light images, apply Ghibli-style effects, and share your creations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="px-8">
              <Link to="/signup">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/explore">Explore Transformations</Link>
            </Button>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="bg-card border rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-lg font-medium mb-2">Prompt-based Transformations</h3>
              <p className="text-muted-foreground">
                Describe the effect you want, and our AI will transform your image accordingly.
              </p>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-lg font-medium mb-2">Low-light Enhancement</h3>
              <p className="text-muted-foreground">
                Turn dark, grainy photos into clear, vibrant images with our enhancement tool.
              </p>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-lg font-medium mb-2">Share & Connect</h3>
              <p className="text-muted-foreground">
                Share your creative transformations and connect with other artists in the community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
