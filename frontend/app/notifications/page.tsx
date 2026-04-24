'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Filter, CheckAll, Settings2 } from 'lucide-react';
import NotificationItem, { NotificationCategory } from '../components/notifications/NotificationItem';

const NotificationsPage = () => {
  const [filter, setFilter] = useState<NotificationCategory | 'all'>('all');

  const notifications = [
    {
      id: 1,
      category: 'competitor' as NotificationCategory,
      title: 'Competitive Strategy Shift',
      message: 'Notion has initiated a major pricing restructure targeting enterprise accounts, potentially impacting your market share in the mid-market segment.',
      time: '12 mins ago',
      isRead: false
    },
    {
      id: 2,
      category: 'insight' as NotificationCategory,
      title: 'Strategic Market Opportunity',
      message: 'AI Core has identified a significant gap in regional localization across Slack’s European expansion. Immediate pivot recommended.',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 3,
      category: 'market' as NotificationCategory,
      title: 'Global Tech Volatility Alert',
      message: 'Recent regulatory changes in the EU tech sector are expected to create compliance headwinds for top 5 rivals.',
      time: '5 hours ago',
      isRead: true
    },
    {
      id: 4,
      category: 'system' as NotificationCategory,
      title: 'Intelligence Core Upgrade',
      message: 'Jupid AI v4.2 is now live with enhanced sentiment analysis and deep-web scraping capabilities.',
      time: '1 day ago',
      isRead: true
    }
  ];

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.category === filter);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <div className="flex items-center space-x-3 text-primary-accent mb-2">
            <Bell size={20} />
            <span className="font-bold uppercase tracking-widest text-xs">Intelligence Feed</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Market Notifications</h1>
          <p className="text-text-secondary mt-1">Real-time alerts and strategic updates from your competitive landscape.</p>
        </div>

        <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-border rounded-xl text-xs font-bold text-text-secondary hover:bg-hover-surface transition-all shadow-sm">
                <span>Mark all as read</span>
            </button>
            <button className="p-2.5 bg-white border border-border rounded-xl text-text-secondary hover:bg-hover-surface transition-colors shadow-sm">
                <Settings2 size={18} />
            </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
        {['all', 'competitor', 'market', 'insight', 'system'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={cn(
                "px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                filter === cat 
                    ? "bg-dark-base text-white shadow-lg" 
                    : "bg-surface text-text-muted hover:text-text-primary border border-border/50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((n) => (
            <NotificationItem 
              key={n.id}
              category={n.category}
              title={n.title}
              message={n.message}
              time={n.time}
              isRead={n.isRead}
            />
          ))
        ) : (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-border">
            <p className="text-text-muted font-bold uppercase tracking-widest text-xs opacity-50">No alerts in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal utility since we can't easily export from layout
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

export default NotificationsPage;
