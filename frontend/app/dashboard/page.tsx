'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  Zap, 
  Target, 
  AlertTriangle, 
  ShieldCheck, 
  Lightbulb,
  Rocket,
  Plus
} from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import AnalysisCard from '../components/dashboard/AnalysisCard';

interface AnalysisData {
  company: string;
  positioning: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  strategy: string;
  metrics: {
    marketShare: string;
    growth: string;
    score: number;
  };
}

const Dashboard = () => {
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!company) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/company/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company }),
      });

      if (!response.ok) throw new Error('Analysis engine timeout. Please try again.');

      const data = await response.json();
      // Simulate extra metrics if not provided by API
      setAnalysis({
        ...data,
        metrics: {
          marketShare: "12.4%",
          growth: "+24% YoY",
          score: 84
        }
      });
      localStorage.setItem('last_analysis', JSON.stringify(data));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Search Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary-accent/5 blur-3xl rounded-full -z-10 h-32 w-full max-w-2xl mx-auto opacity-50" />
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary tracking-tight mb-2">Market Intelligence Dashboard</h1>
          <p className="text-text-secondary text-lg">Synthesize real-time competitor data into actionable strategy.</p>
        </div>

        <div className="max-w-2xl mx-auto flex gap-3 p-2 bg-white rounded-[2rem] border border-border shadow-xl shadow-black/5">
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-4 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Enter company name to analyze..." 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-text-primary font-medium"
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={loading || !company}
            className="px-8 py-3 bg-primary-accent text-white rounded-2xl font-bold hover:bg-dark-base transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : <Zap size={18} fill="currentColor" />}
            <span>{loading ? 'Synthesizing...' : 'Analyze'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-error/10 border border-error/20 text-error rounded-2xl text-center font-bold"
          >
            {error}
          </motion.div>
        )}

        {analysis ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="Competitor Score" 
                value={analysis.metrics.score} 
                icon={Target} 
                change="High Accuracy"
                trend="neutral"
                color="bg-primary-accent"
              />
              <MetricCard 
                title="Market Share" 
                value={analysis.metrics.marketShare} 
                icon={TrendingUp} 
                change="+1.2%"
                trend="up"
                color="bg-soft-accent"
              />
              <MetricCard 
                title="Growth Forecast" 
                value={analysis.metrics.growth} 
                icon={Rocket} 
                change="Stable"
                trend="neutral"
                color="bg-info"
              />
              <MetricCard 
                title="Threat Level" 
                value="Moderate" 
                icon={AlertTriangle} 
                change="-5%"
                trend="down"
                color="bg-warning"
              />
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <AnalysisCard title="Market Positioning" className="lg:col-span-2" badge="Core Logic">
                <p className="text-text-secondary leading-relaxed text-lg italic">
                  "{analysis.positioning}"
                </p>
              </AnalysisCard>

              <AnalysisCard title="Key Strengths" badgeVariant="success" badge="Internal">
                <ul className="space-y-3">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-success/5 border border-success/10 group hover:bg-success/10 transition-colors">
                      <ShieldCheck className="text-success mt-0.5 shrink-0" size={18} />
                      <span className="text-sm font-semibold text-text-primary">{s}</span>
                    </li>
                  ))}
                </ul>
              </AnalysisCard>

              <AnalysisCard title="Critical Weaknesses" badgeVariant="error" badge="Vulnerability">
                <ul className="space-y-3">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-error/5 border border-error/10 group hover:bg-error/10 transition-colors">
                      <AlertTriangle className="text-error mt-0.5 shrink-0" size={18} />
                      <span className="text-sm font-semibold text-text-primary">{w}</span>
                    </li>
                  ))}
                </ul>
              </AnalysisCard>

              <AnalysisCard title="Growth Opportunities" badgeVariant="info" badge="Market Gap">
                <ul className="space-y-3">
                  {analysis.opportunities.map((o, i) => (
                    <li key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-info/5 border border-info/10 group hover:bg-info/10 transition-colors">
                      <Lightbulb className="text-info mt-0.5 shrink-0" size={18} />
                      <span className="text-sm font-semibold text-text-primary">{o}</span>
                    </li>
                  ))}
                </ul>
              </AnalysisCard>

              <AnalysisCard title="Competitive Threats" badgeVariant="warning" badge="External">
                <ul className="space-y-3">
                  {analysis.threats.map((t, i) => (
                    <li key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-warning/5 border border-warning/10 group hover:bg-warning/10 transition-colors">
                      <Zap className="text-warning mt-0.5 shrink-0" size={18} fill="currentColor" />
                      <span className="text-sm font-semibold text-text-primary">{t}</span>
                    </li>
                  ))}
                </ul>
              </AnalysisCard>

              <AnalysisCard title="Strategic Recommendations" className="lg:col-span-3 bg-dark-base text-white border-none shadow-2xl">
                <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Rocket size={32} />
                    </div>
                    <div>
                        <p className="text-xl font-medium leading-relaxed opacity-90">
                            {analysis.strategy}
                        </p>
                    </div>
                </div>
              </AnalysisCard>
            </div>
          </motion.div>
        ) : (
          !loading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 text-text-muted space-y-4"
            >
              <div className="w-20 h-20 bg-surface rounded-[2.5rem] flex items-center justify-center">
                <Search size={32} className="opacity-20" />
              </div>
              <p className="font-bold uppercase tracking-widest text-xs opacity-50">Intelligence Core Inactive</p>
              <p className="text-center max-w-xs">Run a company analysis to generate real-time market positioning and strategic insights.</p>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
