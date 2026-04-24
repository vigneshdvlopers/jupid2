'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, TrendingUp, Shield, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompetitorCardProps {
  name: string;
  description: string;
  score: number;
  strengths: string[];
}

const CompetitorCard: React.FC<CompetitorCardProps> = ({ 
  name, 
  description, 
  score, 
  strengths 
}) => {
  return (
    <motion.div 
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center font-bold text-primary-accent border border-border group-hover:scale-110 transition-transform">
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary tracking-tight">{name}</h3>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center">
              <Shield size={10} className="mr-1" /> Market Rival
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-surface px-2.5 py-1 rounded-lg border border-border">
          <BarChart3 size={14} className="text-primary-accent" />
          <span className="text-sm font-bold text-text-primary">{score}</span>
        </div>
      </div>

      <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-1">
        {description}
      </p>

      <div className="space-y-3 mb-6">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Key Strengths</p>
        <div className="flex flex-wrap gap-2">
          {strengths.slice(0, 3).map((s, i) => (
            <span key={i} className="px-2.5 py-1 bg-soft-accent/10 text-soft-accent text-[11px] font-bold rounded-lg border border-soft-accent/20">
              {s}
            </span>
          ))}
        </div>
      </div>

      <button className="w-full py-2.5 bg-surface text-text-secondary font-bold text-xs rounded-xl border border-border hover:bg-hover-surface hover:text-text-primary transition-all flex items-center justify-center space-x-2">
        <ExternalLink size={14} />
        <span>Deep Analysis</span>
      </button>
    </motion.div>
  );
};

export default CompetitorCard;
