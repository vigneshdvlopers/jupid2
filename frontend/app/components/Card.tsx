import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
}

const Card: React.FC<CardProps> = ({ title, children, className = "", variant = 'default' }) => {
  const baseClass = variant === 'glass' ? 'glass-card' : 'bg-card border border-border/50 shadow-[0_4px_20px_rgba(17,28,45,0.03)]';
  
  return (
    <div className={`${baseClass} rounded-xl p-6 ${className}`}>
      {title && <h3 className="text-xl font-display font-bold text-foreground mb-6">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
