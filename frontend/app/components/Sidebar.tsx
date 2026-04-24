import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { name: 'Chat Analysis', href: '/chat', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { name: 'Competitors', href: '/competitors', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-card border-r border-border w-72 lg:relative lg:translate-x-0`}>
      <div className="flex items-center justify-between h-20 px-8 border-b border-border">
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-sm">J</div>
            <span className="text-lg font-display font-bold tracking-tight text-foreground uppercase">Jupid AI</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
          ✕
        </button>
      </div>
      <nav className="mt-8 px-4 space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="flex items-center px-4 py-3.5 text-sm font-medium text-muted-foreground transition-all duration-200 rounded-lg hover:bg-muted hover:text-primary group"
          >
            <svg className="w-5 h-5 mr-3.5 text-muted-foreground group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
            </svg>
            <span>{item.name}</span>
          </a>
        ))}
        
        <div className="pt-8 mt-8 border-t border-border">
          <button className="flex items-center w-full px-4 py-3.5 text-sm font-medium text-muted-foreground transition-all duration-200 rounded-lg hover:bg-muted hover:text-primary group">
            <svg className="w-5 h-5 mr-3.5 text-muted-foreground group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Developer
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
