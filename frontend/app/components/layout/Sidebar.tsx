'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Bell, 
  Menu, 
  X,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Competitors', href: '/competitors', icon: Users },
    { name: 'Chatbot', href: '/chat', icon: MessageSquare },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white rounded-lg border border-border shadow-sm text-primary-accent"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[50]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-[55] w-72 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-lg lg:shadow-none",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-accent/20">
                <Zap size={22} fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-tight text-text-primary uppercase">Jupid AI</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 group relative",
                    isActive 
                      ? "bg-active-state text-text-primary shadow-sm" 
                      : "text-text-secondary hover:bg-hover-surface hover:text-text-primary"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 mr-4 transition-colors duration-300",
                    isActive ? "text-primary-accent" : "text-muted-foreground group-hover:text-primary-accent"
                  )} />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-primary-accent rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Footer */}
          <div className="p-6 border-t border-border mt-auto bg-white/50">
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white border border-border/50">
              <div className="w-10 h-10 rounded-full bg-soft-accent flex items-center justify-center text-white font-bold">
                ED
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-primary truncate">Executive Director</p>
                <p className="text-xs text-text-muted truncate">Strategy Lead</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
