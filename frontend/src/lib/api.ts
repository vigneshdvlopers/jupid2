const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── SEO ──────────────────────────────────────────────────────────────────────
export const analyzeSEO = (payload: {
  domain: string;
  keywords?: string[];
  competitor_domains?: string[];
}) => fetcher('/seo/analyze', { method: 'POST', body: JSON.stringify(payload) });

// ─── Marketing ────────────────────────────────────────────────────────────────
export const analyzeMarketing = (payload: {
  domain: string;
  campaigns?: Record<string, unknown>[];
}) => fetcher('/marketing/analyze', { method: 'POST', body: JSON.stringify(payload) });

// ─── Sales ────────────────────────────────────────────────────────────────────
export const analyzeSales = (payload: {
  domain: string;
  products?: Record<string, unknown>[];
}) => fetcher('/sales/analyze', { method: 'POST', body: JSON.stringify(payload) });

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const sendChatMessage = (payload: {
  session_id: string;
  message: string;
  context_domain?: string;
}) => fetcher('/chat/', { method: 'POST', body: JSON.stringify(payload) });

export const clearChatSession = (sessionId: string) =>
  fetcher(`/chat/${sessionId}`, { method: 'DELETE' });
