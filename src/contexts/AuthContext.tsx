
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check for stored user data
  useEffect(() => {
    const storedUser = localStorage.getItem('imagifolio_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('imagifolio_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function - in a real app, this would make API calls
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation (replace with actual API call)
      if (email === 'demo@example.com' && password === 'password') {
        const mockUser = {
          id: '1',
          username: 'demouser',
          email: 'demo@example.com',
          profileImageUrl: '/placeholder.svg',
        };
        
        setUser(mockUser);
        localStorage.setItem('imagifolio_user', JSON.stringify(mockUser));
        
        toast.success('Logged in successfully!');
        return true;
      } else {
        toast.error('Invalid credentials. Try demo@example.com / password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation (replace with actual API call)
      const mockUser = {
        id: '1',
        username,
        email,
        profileImageUrl: '/placeholder.svg',
      };
      
      setUser(mockUser);
      localStorage.setItem('imagifolio_user', JSON.stringify(mockUser));
      
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('imagifolio_user');
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
