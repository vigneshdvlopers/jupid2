'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnalysisCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  badge?: string;
  badgeVariant?: 'success' | 'warning' | 'error' | 'info';
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ 
  title, 
  children, 
  className,
  badge,
  badgeVariant = 'info'
}) => {
  return (
    <div className={cn(
      "bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-full",
      className
    )}>
      <div className="px-6 py-4 border-b border-border bg-surface/50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">{title}</h3>
        {badge && (
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter",
            badgeVariant === 'success' ? "bg-success/10 text-success" :
            badgeVariant === 'warning' ? "bg-warning/10 text-warning" :
            badgeVariant === 'error' ? "bg-error/10 text-error" :
            "bg-info/10 text-info"
          )}>
            {badge}
          </span>
        )}
      </div>
      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default AnalysisCard;
