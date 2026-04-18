"use client";
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import PageWrapper from './PageWrapper';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  fullScreen?: boolean;
}

export default function MainLayout({ children, title, fullScreen }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background font-inter selection:bg-accent/30 selection:text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 md:ml-[240px] flex flex-col min-h-screen">
        <Navbar title={title} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className={fullScreen ? 'flex-1 overflow-hidden' : 'flex-1 p-6 md:p-10'}>
          {fullScreen ? (
            <PageWrapper>{children}</PageWrapper>
          ) : (
            <PageWrapper>
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </PageWrapper>
          )}
        </main>
      </div>
    </div>
  );
}
