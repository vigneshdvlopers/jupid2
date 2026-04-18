"use client";
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { Notification } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { SkeletonNotificationItem } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { Bell, CheckCheck, TrendingUp, Newspaper, ShoppingCart, Globe, Sliders } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const { toast } = useToast();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications/unread');
      setNotifications(data);
    } catch (err) {
      toast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      toast('All notifications marked as read', 'success');
      setNotifications([]);
    } catch (err) {
      toast('Failed to mark all as read', 'error');
    }
  };

  const tabs = ['All', 'Unread', 'Stock', 'News', 'Sales', 'Company'];
  
  const getIcon = (type: string) => {
    switch(type) {
      case 'stock': return <TrendingUp size={18} />;
      case 'news': return <Newspaper size={18} />;
      case 'sales': return <ShoppingCart size={18} />;
      default: return <Globe size={18} />;
    }
  };

  const getColor = (type: string) => {
    switch(type) {
      case 'danger': return 'text-danger bg-danger/10';
      case 'warning': return 'text-warning bg-warning/10';
      default: return 'text-accent bg-accent/10';
    }
  };

  const filteredNotifications = notifications?.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.is_read;
    return n.notification_type.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <MainLayout title="Notifications">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-black text-text-primary tracking-tight">Signal Stream</h2>
            <p className="text-text-secondary font-medium">Real-time alerts and market movements</p>
          </div>
          <div className="flex gap-3">
            <Link href="/notifications/settings">
              <Button variant="secondary">
                <Sliders size={18} className="mr-2" /> Alert Settings
              </Button>
            </Link>
            <Button variant="ghost" className="font-bold text-accent" onClick={markAllRead}>
              <CheckCheck size={18} className="mr-2" /> Mark All Read
            </Button>
          </div>
        </div>

        <div className="flex gap-2 p-1 bg-surface2 rounded-xl border border-border-custom w-fit overflow-x-auto no-scrollbar max-w-full">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-surface text-accent shadow-sm border border-border-custom' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <Card padding={false} className="overflow-hidden">
          {loading ? (
            <div className="divide-y divide-border-custom">
              {[1, 2, 3, 4, 5].map(i => <SkeletonNotificationItem key={i} />)}
            </div>
          ) : filteredNotifications && filteredNotifications.length > 0 ? (
            <div className="divide-y divide-border-custom">
              {filteredNotifications.map((n) => (
                <div key={n.id} className={`p-6 flex gap-6 hover:bg-surface2/30 transition-all ${!n.is_read ? 'bg-accent/5' : ''}`}>
                  <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${getColor(n.notification_type)}`}>
                    {getIcon((n as any).type || 'news')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-text-primary text-base truncate pr-10">{n.title}</h4>
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-wider shrink-0 mt-1">
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-3 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-3">
                      <Badge variant="info">{(n as any).competitor?.company_name || 'System'}</Badge>
                      <Badge variant={n.notification_type === 'danger' ? 'danger' : 'default'}>{n.notification_type}</Badge>
                    </div>
                  </div>
                  {!n.is_read && (
                    <div className="w-2 h-2 rounded-full bg-accent self-center -mr-2" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={Bell}
              heading="All caught up!"
              subheading="No new alerts matching your current filters. Everything is looking good."
            />
          )}
        </Card>
      </div>
    </MainLayout>
  );
}
