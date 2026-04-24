'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  color = "bg-primary-accent"
}) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-xl text-white shadow-lg shadow-black/5", color)}>
          <Icon size={20} />
        </div>
        {change && (
          <div className={cn(
            "px-2.5 py-1 rounded-full text-xs font-bold flex items-center",
            trend === 'up' ? "bg-success/10 text-success" : 
            trend === 'down' ? "bg-error/10 text-error" : 
            "bg-muted/10 text-muted-foreground"
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {change}
          </div>
        )}
      </div>
      <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-text-primary tracking-tight">{value}</h3>
    </motion.div>
  );
};

export default MetricCard;
