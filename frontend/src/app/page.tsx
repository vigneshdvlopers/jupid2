import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — Jupid AI',
  description: 'Overview of your SEO, Marketing, and Sales intelligence',
};

const stats = [
  { label: 'SEO Score',        value: '—',  icon: '⬡', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  { label: 'Campaign ROAS',    value: '—',  icon: '◎', color: '#22d3a0', bg: 'rgba(34,211,160,0.12)' },
  { label: 'Revenue Growth',   value: '—',  icon: '▲', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { label: 'AI Analyses Run',  value: '0',  icon: '✦', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
];

const modules = [
  {
    href: '/seo',
    icon: '⬡',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)',
    title: 'SEO Analysis',
    desc: 'Identify ranking opportunities, keyword gaps, on-page scores, and content performance with Gemini AI reasoning.',
  },
  {
    href: '/marketing',
    icon: '◎',
    color: '#22d3a0',
    bg: 'rgba(34,211,160,0.1)',
    title: 'Marketing Analysis',
    desc: 'Evaluate campaign ROAS, funnel drop-offs, acquisition efficiency, and get budget optimization recommendations.',
  },
  {
    href: '/sales',
    icon: '▲',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    title: 'Sales Analysis',
    desc: 'Uncover revenue trends, churn risk, product concentration, and growth opportunities with cross-domain reasoning.',
  },
  {
    href: '/chat',
    icon: '✦',
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.1)',
    title: 'AI Chat',
    desc: 'Chat directly with Jupid\'s Gemini intelligence core. Ask strategic questions with full session memory.',
  },
];

export default function DashboardPage() {
  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          Welcome to <span className="gradient-text">Jupid AI</span>
        </h1>
        <p className="page-subtitle">
          Your AI-powered business intelligence platform — SEO · Marketing · Sales
        </p>
      </div>

      {/* Stats row */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        {stats.map((s) => (
          <div key={s.label} className="metric-card">
            <div className="metric-icon" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div className="metric-label">{s.label}</div>
            <div className="metric-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Module cards */}
      <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
        Analysis Modules
      </h2>
      <div className="grid-2" style={{ marginBottom: '40px' }}>
        {modules.map((m) => (
          <a
            key={m.href}
            href={m.href}
            className="glass-card"
            style={{ padding: '28px', textDecoration: 'none', display: 'block', cursor: 'pointer' }}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: m.bg, color: m.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', marginBottom: '16px',
            }}>
              {m.icon}
            </div>
            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {m.title}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {m.desc}
            </p>
            <div style={{ marginTop: '16px', fontSize: '13px', color: m.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Open module <span>→</span>
            </div>
          </a>
        ))}
      </div>

      {/* How it works */}
      <div className="insight-section">
        <h3>⚡ How Jupid AI Works</h3>
        <ul className="insight-list">
          <li>Input your domain and relevant data (keywords, campaigns, or sales figures)</li>
          <li>Gemini 1.5 Pro reasons across all three business domains simultaneously</li>
          <li>Receive structured insights: Executive Summary, Key Insights, Critical Issues, Opportunities, and Recommended Actions</li>
          <li>All analyses are stored in PostgreSQL for historical tracking and trend analysis</li>
          <li>Use the AI Chat module to ask follow-up strategic questions with full session memory</li>
        </ul>
      </div>
    </div>
  );
}
