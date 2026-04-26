'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/',           label: 'Dashboard',  icon: '◈' },
  { href: '/seo',        label: 'SEO',         icon: '⬡' },
  { href: '/marketing',  label: 'Marketing',   icon: '◎' },
  { href: '/sales',      label: 'Sales',       icon: '▲' },
  { href: '/chat',       label: 'AI Chat',     icon: '✦' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="gradient-text">Jupid</span>
        <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> AI</span>
      </div>

      <nav className="sidebar-nav">
        <p style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px', marginBottom: '8px' }}>
          MENU
        </p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span style={{ fontSize: '16px', width: '18px', textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)', marginTop: '16px' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Jupid AI v1.0</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Powered by Gemini</p>
      </div>
    </aside>
  );
}
