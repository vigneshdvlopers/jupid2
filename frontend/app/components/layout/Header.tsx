'use client';

import React from 'react';
import { Search, Bell, Settings, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-40 px-6 lg:px-8 flex items-center justify-between">
      {/* Search Bar Placeholder */}
      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search market intelligence..." 
            className="w-full pl-12 pr-4 py-2.5 bg-surface border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary-accent/10 focus:border-primary-accent transition-all text-sm"
          />
        </div>
      </div>

      {/* Mobile Title Placeholder */}
      <div className="lg:hidden ml-12">
        <span className="font-bold text-text-primary uppercase tracking-tight">Jupid AI</span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <button className="p-2.5 text-text-secondary hover:bg-hover-surface rounded-xl transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
        </button>
        <button className="p-2.5 text-text-secondary hover:bg-hover-surface rounded-xl transition-colors">
          <HelpCircle size={20} />
        </button>
        <button className="p-2.5 text-text-secondary hover:bg-hover-surface rounded-xl transition-colors">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
