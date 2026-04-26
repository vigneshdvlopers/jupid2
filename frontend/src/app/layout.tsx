import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Jupid AI — Business Intelligence Platform',
  description: 'AI-powered SEO, Marketing, and Sales analysis powered by Google Gemini',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main className="main-content" style={{ flex: 1 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
