import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-foreground mb-1">{label}</label>}
      <input
        className={`w-full px-3 py-2 border border-border rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
