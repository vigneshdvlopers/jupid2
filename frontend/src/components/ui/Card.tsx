import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ title, children, className = '', padding = true }: CardProps) {
  return (
    <div className={`bg-surface border border-border-custom rounded-xl shadow-sm ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-border-custom">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
      )}
      <div className={padding ? 'p-6' : ''}>
        {children}
      </div>
    </div>
  );
}
