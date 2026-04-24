import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1">{label}</label>}
      <input
        className={`w-full px-5 py-3 bg-white dark:bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
