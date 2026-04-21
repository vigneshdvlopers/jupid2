'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import MainLayout from '@/components/layout/MainLayout';

export default function DashboardContent() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    competitors: 0,
    reports: 0,
    notifications: 0,
    messages: 0
  });

  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Safe client-only query param handling
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      saveToken(token);
      toast('Login successful', 'success');
      router.replace('/dashboard');
      return;
    }

    /* 
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    */

    fetchDashboardData();
  }, []);

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
      console.error(err);
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

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">System Overview</h2>
            <p className="text-gray-500">Real-time competitive intelligence workspace</p>
          </div>

          <div className="flex items-center gap-2 text-sm font-bold">
            <TrendingUp size={16} />
            LIVE MARKET DATA CONNECTED
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
            : statCards.map((stat, i) => (
              <Link key={i} href={stat.href}>
                <Card className="hover:scale-[1.02] transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-xs uppercase">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Reports */}
          <div className="lg:col-span-2">
            <Card title="Recent AI Reports" padding={false}>
              {loading ? (
                <div className="p-6">
                  <SkeletonTable />
                </div>
              ) : recentReports.length > 0 ? (
                <div>
                  {recentReports.map((report: any) => (
                    <div key={report.id} className="flex justify-between p-4 border-b">
                      <div>{report.competitor?.company_name || 'Competitor'}</div>
                      <Badge>{report.report_type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center">No reports</div>
              )}
            </Card>
          </div>

          {/* Alerts */}
          <div>
            <Card title="Alerts" padding={false}>
              {loading ? (
                <div className="p-6">Loading...</div>
              ) : recentAlerts.length > 0 ? (
                recentAlerts.map((alert: any) => (
                  <div key={alert.id} className="p-4 border-b">
                    <div className="font-bold">{alert.title}</div>
                    <div className="text-sm text-gray-500">{alert.message}</div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">No alerts</div>
              )}
            </Card>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}