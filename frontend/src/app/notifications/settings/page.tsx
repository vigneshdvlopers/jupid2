"use client";

export const dynamic = "force-dynamic";
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';
import { useToast } from '@/components/ui/Toast';
import { Bell, Sliders, TrendingUp, Newspaper, ShoppingCart, Globe } from 'lucide-react';

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    stock_alerts: true,
    news_alerts: true,
    sales_alerts: true,
    company_alerts: true,
    stock_threshold: 5,
    sales_threshold: 10
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/notifications/settings');
      setSettings(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/notifications/settings', settings);
      toast('Alert settings saved successfully', 'success');
    } catch (err) {
      toast('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const alertRows = [
    { key: 'stock_alerts', label: 'Stock Movement Alerts', desc: 'Notify when competitor stock prices change significantly.', icon: TrendingUp },
    { key: 'news_alerts', label: 'News & Media Coverage', desc: 'Get updates when competitors are mentioned in the press.', icon: Newspaper },
    { key: 'sales_alerts', label: 'Sales & Inventory Changes', desc: 'Track Amazon ASIN rank changes and stock-outs.', icon: ShoppingCart },
    { key: 'company_alerts', label: 'General Company News', desc: 'Updates on hirings, job postings and company moves.', icon: Globe },
  ];

  return (
    <MainLayout title="Alert Configuration">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-black text-text-primary tracking-tight">Notification Settings</h2>
          <p className="text-text-secondary font-medium">Fine-tune the signals you receive from Jupid AI</p>
        </div>

        <Card title="Alert Subscriptions">
          <div className="divide-y divide-border-custom">
            {alertRows.map((row) => (
              <div key={row.key} className="py-6 flex items-center justify-between gap-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-surface2 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <row.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary mb-1">{row.label}</h4>
                    <p className="text-xs text-text-muted font-medium">{row.desc}</p>
                  </div>
                </div>
                <Toggle 
                  checked={(settings as any)[row.key]} 
                  onChange={(val) => setSettings({...settings, [row.key]: val})} 
                />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Threshold Sensitivity">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-text-primary uppercase tracking-wider">Stock Price Change Threshold (%)</label>
                <span className="text-sm font-black text-accent">{settings.stock_threshold}%</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={settings.stock_threshold}
                onChange={(e) => setSettings({...settings, stock_threshold: parseInt(e.target.value)})}
                className="w-full h-2 bg-surface2 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <p className="text-[10px] text-text-muted font-bold text-right">Sensitivity: {settings.stock_threshold < 5 ? 'EXTREME' : settings.stock_threshold < 15 ? 'BALANCED' : 'SIGNIFICANT ONLY'}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border-custom">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-text-primary uppercase tracking-wider">Sales Rank Change Threshold (%)</label>
                <span className="text-sm font-black text-accent">{settings.sales_threshold}%</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={settings.sales_threshold}
                onChange={(e) => setSettings({...settings, sales_threshold: parseInt(e.target.value)})}
                className="w-full h-2 bg-surface2 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <p className="text-[10px] text-text-muted font-bold text-right">Sensitivity: {settings.sales_threshold < 7 ? 'EXTREME' : settings.sales_threshold < 20 ? 'BALANCED' : 'MAJOR MOVES ONLY'}</p>
            </div>
          </div>
        </Card>

        <Button size="lg" className="w-full h-14 font-black text-lg tracking-tight" onClick={handleSave} loading={loading}>
          SAVE CONFIGURATION
        </Button>
      </div>
    </MainLayout>
  );
}
