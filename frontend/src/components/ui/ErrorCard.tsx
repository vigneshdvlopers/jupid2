import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="bg-danger/5 border border-danger/20 rounded-xl p-8 flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center text-danger mb-4">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">Something went wrong</h3>
      <p className="text-text-secondary mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger">
          Try Again
        </Button>
      )}
    </div>
  );
}
