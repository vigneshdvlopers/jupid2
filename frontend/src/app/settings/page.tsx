"use client";

export const dynamic = "force-dynamic";
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { User } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { 
  ShieldCheck, 
  Calendar
} from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data: me } = await api.get('/auth/me');
      setUser(me);
    } catch (err) {
      console.error(err);
      toast('Failed to load user profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <MainLayout title="Account Settings">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-black text-text-primary tracking-tight">Configuration</h2>
          <p className="text-text-secondary font-medium">Manage your profile and account information</p>
        </div>

        <div className="flex gap-2 p-1 bg-surface2 rounded-xl border border-border-custom w-fit">
          <button
            className="px-6 py-2.5 text-xs font-bold rounded-lg transition-all bg-surface text-accent shadow-sm border border-border-custom"
          >
            PROFILE
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 animate-in fade-in duration-500">
          <Card className="md:col-span-1 text-center py-10">
            <div className="w-24 h-24 bg-gradient-primary rounded-3xl mx-auto flex items-center justify-center text-4xl font-black text-white mb-6">
              {user?.name?.[0] || 'U'}
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-1">{user?.name}</h3>
            <p className="text-sm text-text-muted mb-8 font-medium">{user?.email}</p>
            <Badge variant="info">Enterprise Member</Badge>
          </Card>

          <Card className="md:col-span-2" title="User Information">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Login Method</p>
                  <div className="flex items-center gap-2 text-text-primary font-bold">
                    <ShieldCheck size={16} className="text-success" /> Google OAuth
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Platform Role</p>
                  <div className="text-text-primary font-bold">{user?.is_admin ? 'Strategic Administrator' : 'Strategic Analyst'}</div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Member Since</p>
                  <div className="flex items-center gap-2 text-text-primary font-bold whitespace-nowrap">
                    <Calendar size={16} className="text-accent" /> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Loading...'}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Account Status</p>
                  <Badge variant="success">ACTIVE</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

