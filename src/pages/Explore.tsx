
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useImages, ImageTransformation } from '@/contexts/ImageContext';
import ImagePost from '@/components/image/ImagePost';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Explore: React.FC = () => {
  const { posts } = useImages();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<ImageTransformation | 'all'>('all');
  
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.prompt?.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesFilter = activeFilter === 'all' || post.transformation === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const filters: { label: string; value: ImageTransformation | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Ghibli Style', value: 'ghibli' },
    { label: 'Low Light', value: 'lowlight' },
    { label: 'Vintage', value: 'vintage' },
    { label: 'Cartoon', value: 'cartoon' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Explore Transformations</h1>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex overflow-x-auto pb-4 mb-6 space-x-2">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.value)}
              className="whitespace-nowrap"
            >
              {filter.label}
            </Button>
          ))}
        </div>
        
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <ImagePost key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No matching posts found</h3>
            <p className="text-muted-foreground mb-4">
              Try changing your search term or filter
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setActiveFilter('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;
