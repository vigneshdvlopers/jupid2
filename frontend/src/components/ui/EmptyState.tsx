import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  heading: string;
  subheading: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, heading, subheading, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 bg-surface2 rounded-2xl flex items-center justify-center text-text-muted mb-6">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">{heading}</h3>
      <p className="text-text-secondary mb-8 max-w-sm">{subheading}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}
