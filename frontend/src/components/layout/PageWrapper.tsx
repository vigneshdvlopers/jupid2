"use client";
import React from 'react';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in duration-500 ease-out fill-mode-forwards">
      {children}
    </div>
  );
}
