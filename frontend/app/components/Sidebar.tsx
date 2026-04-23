import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Competitors', href: '/competitors', icon: '👥' },
    { name: 'Chatbot', href: '/chat', icon: '🤖' },
    { name: 'Notifications', href: '/notifications', icon: '🔔' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 w-64 lg:relative lg:translate-x-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">JUPID AI</span>
        <button onClick={() => setIsOpen(false)} className="lg:hidden">
          ✕
        </button>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="flex items-center px-6 py-3 text-gray-600 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
