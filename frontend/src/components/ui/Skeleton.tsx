import React, { CSSProperties } from 'react';

const SkeletonBase = ({ className = '', style }: { className?: string; style?: CSSProperties }) => (
  <div className={`bg-surface2 animate-shimmer rounded ${className}`} style={style} />
);

export const SkeletonCard = () => (
  <div className="bg-surface border border-border-custom rounded-xl p-6 space-y-4">
    <SkeletonBase className="h-6 w-1/3" />
    <SkeletonBase className="h-20 w-full" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-4">
    <div className="flex gap-4">
      {[1, 2, 3, 4].map(i => <SkeletonBase key={i} className="h-8 flex-1" />)}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 border-t border-border-custom pt-4">
        {[1, 2, 3, 4].map(j => <SkeletonBase key={j} className="h-6 flex-1" />)}
      </div>
    ))}
  </div>
);

export const SkeletonText = ({ lines = 1 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBase key={i} className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

export const SkeletonStockChart = () => (
  <div className="h-64 flex flex-col gap-4">
    <SkeletonBase className="flex-1 w-full" />
    <div className="flex justify-between">
      {[1, 2, 3, 4, 5, 6].map(i => <SkeletonBase key={i} className="h-4 w-12" />)}
    </div>
  </div>
);

export const SkeletonSalesChart = () => (
  <div className="h-64 flex items-end gap-2">
    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
      <SkeletonBase key={i} className="flex-1" style={{ height: `${Math.random() * 80 + 20}%` }} />
    ))}
  </div>
);

export const SkeletonCompetitorCard = () => (
  <div className="bg-surface border border-border-custom rounded-xl p-6 space-y-4">
    <div className="flex justify-between items-start">
      <SkeletonBase className="h-6 w-1/2" />
      <SkeletonBase className="h-6 w-16 rounded-full" />
    </div>
    <div className="space-y-2">
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-3/4" />
      <SkeletonBase className="h-4 w-1/2" />
    </div>
    <div className="flex gap-2 pt-4">
      <SkeletonBase className="h-10 flex-1" />
      <SkeletonBase className="h-10 flex-1" />
    </div>
  </div>
);

export const SkeletonNotificationItem = () => (
  <div className="flex gap-4 p-4 border-b border-border-custom">
    <SkeletonBase className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <SkeletonBase className="h-4 w-1/4" />
      <SkeletonBase className="h-3 w-3/4" />
    </div>
  </div>
);

export const SkeletonMessageCard = () => (
  <div className="bg-surface2 p-4 rounded-xl space-y-2">
    <SkeletonBase className="h-4 w-full" />
    <SkeletonBase className="h-4 w-2/3" />
    <SkeletonBase className="h-3 w-20 self-end" />
  </div>
);

export default function Skeleton() { return null; }
