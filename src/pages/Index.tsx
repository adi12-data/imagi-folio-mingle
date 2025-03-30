
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Index page that redirects to the Home page
 * This ensures that the root route displays the proper home content
 */
const Index = () => {
  // Simple redirect to the Home page
  return <Navigate to="/" replace />;
};

export default Index;
