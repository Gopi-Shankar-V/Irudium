import React from 'react';

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating particles */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-3 h-3 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-60 left-1/4 w-1 h-1 bg-primary/40 rounded-full animate-float" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-40 right-10 w-2 h-2 bg-accent/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-60 left-20 w-3 h-3 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '3s' }} />
      
      {/* Larger floating elements */}
      <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full animate-float blur-sm" style={{ animationDelay: '2.5s' }} />
      <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-gradient-to-l from-accent/5 to-primary/5 rounded-full animate-float blur-sm" style={{ animationDelay: '1.5s' }} />
    </div>
  );
};

export default FloatingElements;