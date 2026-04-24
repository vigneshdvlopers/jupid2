'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Info,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationCategory = 'competitor' | 'market' | 'insight' | 'system';

interface NotificationItemProps {
  category: NotificationCategory;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  category, 
  title, 
  message, 
  time,
  isRead
}) => {
  const config = {
    competitor: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
    market: { icon: TrendingUp, color: "text-info", bg: "bg-info/10" },
    insight: { icon: Zap, color: "text-soft-accent", bg: "bg-soft-accent/10" },
    system: { icon: Info, color: "text-primary-accent", bg: "bg-primary-accent/10" },
  };

  const { icon: Icon, color, bg } = config[category];

  return (
    <motion.div 
      whileHover={{ scale: 1.005 }}
      className={cn(
        "p-5 rounded-2xl border transition-all duration-300 flex items-start space-x-4 group cursor-pointer",
        isRead ? "bg-white border-border/50" : "bg-white border-primary-accent/20 shadow-md shadow-primary-accent/5"
      )}
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", bg)}>
        <Icon className={color} size={22} fill={category === 'insight' ? 'currentColor' : 'none'} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className={cn("font-bold tracking-tight text-sm", isRead ? "text-text-primary" : "text-text-primary underline decoration-primary-accent/30 decoration-2")}>
            {title}
          </h4>
          {!isRead && (
            <span className="w-2 h-2 bg-primary-accent rounded-full" />
          )}
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-3 line-clamp-2">
          {message}
        </p>
        <div className="flex items-center space-x-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">
          <span className="flex items-center"><Clock size={12} className="mr-1" /> {time}</span>
          <span className="flex items-center hover:text-primary-accent transition-colors"><CheckCircle2 size={12} className="mr-1" /> Mark as read</span>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;
