"use client";

export const dynamic = "force-dynamic";
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { Competitor } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { SkeletonCompetitorCard } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { Search, Globe, Hash, Zap, BarChart3, MessageSquare, Users } from 'lucide-react';
import Link from 'next/link';

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchCompetitors = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/competitors/my');
      setCompetitors(data);
    } catch (err) {
      toast('Failed to load competitors', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const handleGenerateReport = async (competitorId: number) => {
    setGenerating(competitorId);
    try {
      await api.post(`/reports/generate/${competitorId}`);
      toast('AI Report generation started!', 'success');
    } catch (err) {
      toast('Failed to start report generation', 'error');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <MainLayout title="Competitors">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-text-primary tracking-tight">Active Coverage</h2>
          <p className="text-text-secondary font-medium">Competitors assigned to your account by the Jupid AI team</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <SkeletonCompetitorCard key={i} />)}
          </div>
        ) : competitors && competitors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitors.map((comp) => (
              <Card key={comp.id} className="group hover:border-accent/40 transition-all flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface2 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <BarChart3 size={24} />
                  </div>
                  <Badge variant="info">{comp.industry}</Badge>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  <h3 className="text-xl font-bold text-text-primary">{comp.company_name}</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <Globe size={14} className="text-text-muted" />
                      <span className="text-text-secondary">{comp.domain}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <Hash size={14} className="text-text-muted" />
                      <span className="text-text-secondary">Ticker: {comp.stock_ticker || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <Search size={14} className="text-text-muted" />
                      <span className="text-text-secondary">ASIN: {comp.amazon_asin || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href={`/reports?competitor=${comp.id}`} className="flex-1">
                    <Button variant="secondary" className="w-full font-bold uppercase text-[10px] tracking-widest">
                      View Reports
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => handleGenerateReport(comp.id)}
                    loading={generating === comp.id}
                    className="flex-1 font-bold uppercase text-[10px] tracking-widest"
                  >
                    <Zap size={12} className="mr-1" /> Generate
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={Users}
            heading="No competitors tracking yet"
            subheading="Please contact the Jupid AI team to add competitors to your workspace."
            action={
              <Link href="/messages">
                <Button>
                  <MessageSquare size={18} className="mr-2" /> Send Message to Team
                </Button>
              </Link>
            }
          />
        )}
      </div>
    </MainLayout>
  );
}
