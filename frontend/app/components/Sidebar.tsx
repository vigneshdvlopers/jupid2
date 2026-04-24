import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  
  const menuItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Competitors', href: '/competitors' },
    { name: 'Chatbot', href: '/chat' },
    { name: 'Notifications', href: '/notifications' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-white border-r border-border w-64 lg:relative lg:translate-x-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-border">
        <span className="text-xl font-bold text-primary">Jupid AI</span>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-secondary">
          ✕
        </button>
      </div>
      <nav className="mt-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded transition-colors ${
              pathname === item.href 
                ? 'bg-primary text-primary-foreground' 
                : 'text-secondary hover:bg-muted hover:text-foreground'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
