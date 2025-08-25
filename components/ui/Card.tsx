import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false,
  onClick,
  padding = 'md'
}: CardProps) {
  const baseClasses = gradient 
    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none'
    : 'theme-card';
    
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';
  
  const paddingClasses = {
    'none': '',
    'sm': 'p-3',
    'md': 'p-4 sm:p-6',
    'lg': 'p-6 sm:p-8'
  };

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${paddingClasses[padding]} transition-all duration-200 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}