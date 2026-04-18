"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { saveToken, isLoggedIn } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import { 
  Users, 
  FileText, 
  Bell, 
  MessageSquare, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { SkeletonCard, SkeletonTable } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    competitors: 0,
    reports: 0,
    notifications: 0,
    messages: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);

  useEffect(() => {
    // Auth handling
    const token = searchParams.get('token');
    if (token) {
      saveToken(token);
      toast('Login successful', 'success');
      router.replace('/dashboard');
      return;
    }

    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [searchParams, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [compRes, reportsRes, notifRes, msgRes] = await Promise.all([
        api.get('/competitors/my'),
        api.get('/reports'),
        api.get('/notifications/unread'),
        api.get('/messages/my')
      ]);

      setStats({
        competitors: compRes.data.length,
        reports: reportsRes.data.length,
        notifications: notifRes.data.length,
        messages: msgRes.data.length
      });

      setRecentReports(reportsRes.data.slice(0, 5));
      setRecentAlerts(notifRes.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      toast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Competitors', value: stats.competitors, icon: Users, color: 'text-accent', bg: 'bg-accent/10', href: '/competitors' },
    { label: 'AI Reports', value: stats.reports, icon: FileText, color: 'text-accent2', bg: 'bg-accent2/10', href: '/reports' },
    { label: 'Unread Alerts', value: stats.notifications, icon: Bell, color: 'text-warning', bg: 'bg-warning/10', href: '/notifications' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'text-success', bg: 'bg-success/10', href: '/messages' },
  ];

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-text-primary tracking-tight">System Overview</h2>
            <p className="text-text-secondary font-medium">Real-time competitive intelligence workspace</p>
          </div>
          <div className="flex items-center gap-2 text-text-muted text-sm font-bold bg-surface2 px-4 py-2 rounded-xl border border-border-custom">
            <TrendingUp size={16} className="text-success" />
            LIVE MARKET DATA CONNECTED
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
          ) : (
            statCards.map((stat, i) => (
              <Link key={i} href={stat.href}>
                <Card className="hover:border-accent/40 transition-all group overflow-hidden relative">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
                      <p className="text-2xl font-black text-text-primary">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <Card title="Recent AI Reports" padding={false}>
              {loading ? (
                <div className="p-6"><SkeletonTable /></div>
              ) : recentReports.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface2/50 text-text-muted text-[10px] font-black uppercase tracking-widest border-b border-border-custom">
                        <th className="px-6 py-4">Competitor</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom">
                      {recentReports.map((report: any) => (
                        <tr key={report.id} className="hover:bg-surface2/30 transition-colors group">
                          <td className="px-6 py-4 font-bold text-sm">{report.competitor?.company_name || 'Competitor'}</td>
                          <td className="px-6 py-4">
                            <Badge variant="info">{report.report_type}</Badge>
                          </td>
                          <td className="px-6 py-4 text-xs text-text-muted font-medium">
                            {new Date(report.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link href={`/reports/${report.id}`}>
                              <Button size="sm" variant="ghost" className="text-accent hover:underline font-bold">
                                VIEW DATA <ArrowRight size={14} className="ml-1" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Link href="/reports" className="block text-center py-4 text-xs font-bold text-text-muted hover:text-accent transition-colors border-t border-border-custom">
                    VIEW ALL REPORTS
                  </Link>
                </div>
              ) : (
                <div className="p-12 text-center text-text-muted italic">No reports found</div>
              )}
            </Card>
          </div>

          {/* Recent Alerts */}
          <div>
            <Card title="Latest Market Alerts" padding={false}>
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-surface2 rounded-xl animate-pulse" />)}
                </div>
              ) : recentAlerts.length > 0 ? (
                <div className="divide-y divide-border-custom">
                  {recentAlerts.map((alert: any) => (
                    <div key={alert.id} className="p-6 hover:bg-surface2/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={alert.notification_type === 'danger' ? 'danger' : 'info'}>
                          {alert.notification_type}
                        </Badge>
                        <span className="text-[10px] text-text-muted font-bold">{new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <h4 className="text-sm font-bold text-text-primary mb-1">{alert.title}</h4>
                      <p className="text-xs text-text-secondary line-clamp-2">{alert.message}</p>
                    </div>
                  ))}
                  <Link href="/notifications" className="block text-center py-4 text-xs font-bold text-text-muted hover:text-accent transition-colors">
                    VIEW ALL HISTORY
                  </Link>
                </div>
              ) : (
                <div className="p-12 text-center text-text-muted italic">No active alerts</div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
