
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImages, ImageTransformation } from '@/contexts/ImageContext';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Camera, Upload } from 'lucide-react';

const Create: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [transformation, setTransformation] = useState<ImageTransformation>('original');
  const [prompt, setPrompt] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadImage } = useImages();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select an image to upload');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const success = await uploadImage(
        selectedFile,
        caption,
        transformation,
        prompt || undefined
      );
      
      if (success) {
        navigate('/');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const transformations = [
    { value: 'original', label: 'Original (No Effect)' },
    { value: 'ghibli', label: 'Ghibli Style' },
    { value: 'lowlight', label: 'Low Light Enhancement' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'cartoon', label: 'Cartoon' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card className="mb-6">
              <CardContent className="pt-6">
                {preview ? (
                  <div className="relative aspect-square rounded-md overflow-hidden bg-muted">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <Button
                      variant="secondary"
                      className="absolute bottom-4 right-4"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreview(null);
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center bg-muted/50 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-medium">Upload an image</p>
                    <p className="text-xs text-muted-foreground mt-1">Click to browse files</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Tips</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use high-quality images for better results</li>
                <li>• For Ghibli transformations, use descriptive prompts</li>
                <li>• Low-light enhancement works best on darker images</li>
              </ul>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                placeholder="Write a caption for your image..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transformation">Transformation</Label>
              <Select
                value={transformation}
                onValueChange={(value) => setTransformation(value as ImageTransformation)}
              >
                <SelectTrigger id="transformation">
                  <SelectValue placeholder="Select transformation" />
                </SelectTrigger>
                <SelectContent>
                  {transformations.map((t) => (
                    <SelectItem key={t.value} value={t.value as string}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {transformation !== 'original' && transformation !== 'lowlight' && (
              <div className="space-y-2">
                <Label htmlFor="prompt">Transformation Prompt (Optional)</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the style or elements you want in your transformation..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  For example: "Transform into Ghibli style with magical forest elements"
                </p>
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full"
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full"></span>
                  Transforming...
                </span>
              ) : (
                <span className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Post Image
                </span>
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Create;
