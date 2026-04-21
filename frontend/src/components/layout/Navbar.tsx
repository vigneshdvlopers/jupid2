"use client";
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  User as UserIcon, 
  Menu, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  BarChart3, 
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import api from '@/lib/api';
import { Notification, SalesDataPoint } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Badge from '../ui/Badge';
import { getUser, removeToken } from '@/lib/auth';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

// Mock data for graphs
const MOCK_SALES_DATA: SalesDataPoint[] = [
  { month: 'Jan', revenue: 4000, units: 100 },
  { month: 'Feb', revenue: 3000, units: 80 },
  { month: 'Mar', revenue: 2000, units: 60 },
  { month: 'Apr', revenue: 2780, units: 90 },
  { month: 'May', revenue: 1890, units: 50 },
  { month: 'Jun', revenue: 2390, units: 75 },
  { month: 'Jul', revenue: 3490, units: 110 },
];

const MOCK_STOCK_DATA = [
  { name: 'Item A', stock: 400 },
  { name: 'Item B', stock: 300 },
  { name: 'Item C', stock: 200 },
  { name: 'Item D', stock: 278 },
  { name: 'Item E', stock: 189 },
];

interface NavbarProps {
  title: string;
  onMenuClick: () => void;
}

export default function Navbar({ title, onMenuClick }: NavbarProps) {
  const router = useRouter();
  const user = getUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userTab, setUserTab] = useState<'General' | 'Insights'>('General');

  const fetchUnread = async () => {
    try {
      const { data } = await api.get('/notifications/unread');
      setUnreadCount(data.length);
      setRecentNotifications(data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch unread notifications', error);
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await api.post(`/notifications/${id}/read`);
      fetchUnread();
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push('/');
  };

  return (
    <nav className="h-14 bg-surface/80 backdrop-blur-md border-b border-border-custom flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 text-text-secondary hover:text-text-primary">
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-bold text-text-primary tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowUserDropdown(false);
            }}
            className="p-2 text-text-secondary hover:text-text-primary transition-all relative rounded-xl hover:bg-surface2"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-surface" />
            )}
          </button>

          {showNotifDropdown && (
            <>
              <div className="fixed inset-0" onClick={() => setShowNotifDropdown(false)} />
              <div className="absolute top-12 right-0 w-80 bg-surface border border-border-custom rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-border-custom flex justify-between items-center bg-surface2">
                  <span className="font-bold text-sm">Notifications</span>
                  <Link 
                    href="/notifications" 
                    className="text-xs text-accent hover:underline font-medium"
                    onClick={() => setShowNotifDropdown(false)}
                  >
                    View all
                  </Link>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {recentNotifications.length > 0 ? (
                    recentNotifications.map((n) => (
                      <div key={n.id} className="p-4 border-b border-border-custom bg-surface hover:bg-surface2 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-bold text-text-primary leading-tight">{n.title}</p>
                          <Badge variant={n.notification_type === 'danger' ? 'danger' : 'info'}>{n.notification_type}</Badge>
                        </div>
                        <p className="text-xs text-text-secondary line-clamp-2 mb-2">{n.message}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-text-muted font-medium">
                            {new Date(n.created_at).toLocaleDateString()}
                          </span>
                          <button 
                            onClick={() => markAsRead(n.id)}
                            className="text-[10px] text-accent hover:underline font-bold"
                          >
                            Mark read
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-12 h-12 bg-surface2 rounded-full flex items-center justify-center mx-auto mb-3 text-text-muted">
                        <Bell size={20} />
                      </div>
                      <p className="text-text-muted text-sm font-medium italic">Everything quiet here.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-xl border border-border-custom bg-surface2 hover:bg-surface transition-all active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-black text-xs uppercase">
              {user?.name?.[0] || 'U'}
            </div>
            <ChevronDown size={14} className={`text-text-muted transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showUserDropdown && (
            <>
              <div className="fixed inset-0" onClick={() => setShowUserDropdown(false)} />
              <div className="absolute top-12 right-0 w-[320px] bg-surface border border-border-custom rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-border-custom bg-surface2/50">
                  <div className="flex gap-2 p-1 bg-surface2 rounded-xl border border-border-custom w-full">
                    <button
                      onClick={() => setUserTab('General')}
                      className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${
                        userTab === 'General' ? 'bg-surface text-accent shadow-sm border border-border-custom' : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      Identity
                    </button>
                    <button
                      onClick={() => setUserTab('Insights')}
                      className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${
                        userTab === 'Insights' ? 'bg-surface text-accent shadow-sm border border-border-custom' : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      Insights
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {userTab === 'General' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-accent/5">
                            {user?.name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-black text-text-primary truncate max-w-[180px]">{user?.name}</p>
                            <p className="text-[10px] text-text-muted font-bold truncate max-w-[180px]">{user?.email}</p>
                          </div>
                        </div>
                        <div className="bg-surface2 p-3 rounded-xl border border-border-custom">
                          <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck size={14} className="text-success" />
                            <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">
                              {user?.is_admin ? 'Strategic Admin' : 'Strategic Analyst'}
                            </span>
                          </div>
                          <p className="text-[10px] text-text-muted font-medium">Full repository access enabled</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full p-2.5 rounded-xl text-text-muted hover:text-danger hover:bg-danger/5 transition-all group"
                        >
                          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                          <span className="text-xs font-bold">Terminate Session</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp size={14} className="text-accent" />
                            <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">Sales Trend</span>
                          </div>
                          <span className="text-[10px] font-bold text-success">+14.2%</span>
                        </div>
                        <div className="h-24 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_SALES_DATA}>
                              <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#7C6FF7" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#7C6FF7" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2E2E45" strokeOpacity={0.3} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#1A1A2E', border: '1px solid #2E2E45', borderRadius: '8px', fontSize: '10px' }}
                                itemStyle={{ fontWeight: 'bold' }}
                                labelStyle={{ display: 'none' }}
                              />
                              <Area type="monotone" dataKey="revenue" stroke="#7C6FF7" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border-custom">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 size={14} className="text-accent2" />
                          <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">Stock Health</span>
                        </div>
                        <div className="h-24 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_STOCK_DATA}>
                              <Bar dataKey="stock" radius={[2, 2, 0, 0]}>
                                {MOCK_STOCK_DATA.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4F8EF7' : '#7C6FF7'} fillOpacity={0.8} />
                                ))}
                              </Bar>
                              <Tooltip 
                                cursor={{ fill: '#2E2E45', opacity: 0.1 }}
                                contentStyle={{ backgroundColor: '#1A1A2E', border: '1px solid #2E2E45', borderRadius: '8px', fontSize: '10px' }}
                                labelStyle={{ display: 'none' }}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

