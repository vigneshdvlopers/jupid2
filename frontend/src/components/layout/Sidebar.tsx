"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bell, 
  MessageSquare, 
  Settings, 
  LogOut,
  X,
  Bot
} from 'lucide-react';
import { removeToken, getUser } from '@/lib/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Competitors', href: '/competitors', icon: Users },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'Chat AI', href: '/chat', icon: Bot },
    { label: 'Notifications', href: '/notifications', icon: Bell },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];


  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-[240px] bg-surface border-r border-border-custom
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Top: Logo & Close Button */}
          <div className="flex items-center justify-between h-14 px-6 border-b border-border-custom">
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Jupid AI
            </span>
            <button onClick={onClose} className="md:hidden p-1 text-text-muted hover:text-text-primary">
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center font-bold text-white text-lg">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-primary truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-text-muted truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => onClose()}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-accent/10 text-accent font-semibold border border-accent/20' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface2'}
                  `}
                >
                  <Icon size={20} />
                  <span className="text-sm">{link.label}</span>
                  {link.label === 'Notifications' && (
                    <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                      3
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom logout */}
          <div className="p-4 border-t border-border-custom">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-text-muted hover:text-danger hover:bg-danger/5 transition-all"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
