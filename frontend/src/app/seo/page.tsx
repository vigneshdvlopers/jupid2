'use client';

import { useState } from 'react';
import { analyzeSEO } from '@/lib/api';

interface GeminiInsight {
  executive_summary: string;
  key_insights: string[];
  critical_issues: string[];
  opportunities: string[];
  recommended_actions: string[];
  confidence_level: 'High' | 'Medium' | 'Low';
}

interface SEOResult {
  domain: string;
  insight: GeminiInsight;
}

const confidenceColor = { High: 'badge-success', Medium: 'badge-warning', Low: 'badge-danger' };

export default function SEOPage() {
  const [domain, setDomain] = useState('');
  const [keywords, setKeywords] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SEOResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await analyzeSEO({
        domain: domain.trim(),
        keywords: keywords ? keywords.split(',').map((k) => k.trim()).filter(Boolean) : [],
        competitor_domains: competitors ? competitors.split(',').map((c) => c.trim()).filter(Boolean) : [],
      }) as SEOResult;
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">
          <span style={{ color: '#6366f1' }}>⬡</span> SEO Analysis
        </h1>
        <p className="page-subtitle">Identify ranking opportunities and keyword gaps powered by Gemini AI</p>
      </div>

      {/* Input card */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '28px' }}>
        <div className="grid-3" style={{ marginBottom: '20px' }}>
          <div>
            <label className="field-label">Domain *</label>
            <input className="input-field" placeholder="example.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Target Keywords (comma-separated)</label>
            <input className="input-field" placeholder="seo tools, rank tracker..." value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Competitor Domains (optional)</label>
            <input className="input-field" placeholder="competitor.com, rival.io" value={competitors} onChange={(e) => setCompetitors(e.target.value)} />
          </div>
        </div>
        <button className="btn-primary" onClick={handleAnalyze} disabled={loading || !domain.trim()}>
          {loading ? <><span className="spinner" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block' }} /></> : '⬡'}
          {loading ? 'Analyzing with Gemini...' : 'Run SEO Analysis'}
        </button>
        {error && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '12px' }}>⚠ {error}</p>}
      </div>

      {/* Result */}
      {result && (
        <div className="animate-in">
          {/* Summary bar */}
          <div className="glass-card" style={{ padding: '20px 28px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Analysis for</p>
              <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>{result.domain}</p>
            </div>
            <span className={`confidence-badge ${confidenceColor[result.insight.confidence_level] || 'badge-info'}`}>
              ● {result.insight.confidence_level} Confidence
            </span>
          </div>

          {/* Executive summary */}
          <div className="insight-section" style={{ marginBottom: '20px' }}>
            <h3>📋 Executive Summary</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{result.insight.executive_summary}</p>
          </div>

          <div className="grid-2" style={{ marginBottom: '20px' }}>
            <div className="insight-section">
              <h3>💡 Key Insights</h3>
              <ul className="insight-list">{result.insight.key_insights.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
            </div>
            <div className="insight-section">
              <h3>⚠ Critical Issues</h3>
              <ul className="insight-list">{result.insight.critical_issues.map((i, idx) => <li key={idx} style={{ color: 'var(--danger)' }}>{i}</li>)}</ul>
            </div>
          </div>

          <div className="grid-2">
            <div className="insight-section">
              <h3>🚀 Opportunities</h3>
              <ul className="insight-list">{result.insight.opportunities.map((i, idx) => <li key={idx} style={{ color: 'var(--success)' }}>{i}</li>)}</ul>
            </div>
            <div className="insight-section">
              <h3>✅ Recommended Actions</h3>
              <ul className="insight-list">{result.insight.recommended_actions.map((a, idx) => <li key={idx}><span style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, marginRight: '4px' }}>{idx + 1}</span>{a}</li>)}</ul>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⬡</div>
          <p style={{ fontSize: '15px' }}>Enter a domain above to start your SEO analysis</p>
        </div>
      )}
    </div>
  );
}
