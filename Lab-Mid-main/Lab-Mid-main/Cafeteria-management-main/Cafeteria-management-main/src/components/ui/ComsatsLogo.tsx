import React from 'react';
import { cn } from '@/lib/utils';

interface ComsatsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'custom';
  width?: number | string;
  height?: number | string;
}

const ComsatsLogo: React.FC<ComsatsLogoProps> = ({ 
  className, 
  size = 'md',
  width,
  height
}) => {
  // Sizing based on requirements
  const sizeClasses = {
    sm: 'w-10 h-10', // Navbar: 40px
    md: 'w-[50px] h-[50px]', // Sidebar: 50px
    lg: 'w-[100px] h-[100px]', // Login/Register: 100px
    custom: ''
  };

  const style = size === 'custom' ? { width, height } : {};

  return (
    <img 
      src="/comsats-logo.png" 
      alt="COMSATS University Islamabad" 
      className={cn(
        "object-contain drop-shadow-lg transition-all duration-300",
        size !== 'custom' && sizeClasses[size],
        className
      )}
      style={style}
      onError={(e) => { 
        // Fallback if local file is missing
        e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/en/c/c0/COMSATS_University_logo.png'; 
      }} 
    />
  );
};

export default ComsatsLogo;