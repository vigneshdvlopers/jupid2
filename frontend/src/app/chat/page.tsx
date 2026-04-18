"use client";

export const dynamic = "force-dynamic";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Send, Bot, User, Loader2, Plus, MessageSquare,
  Clock, ChevronRight, Sparkles, MoreVertical
} from 'lucide-react';
import api from '@/lib/api';

// ---------- Types ----------

interface Message {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

interface Session {
  id: number;
  title: string;
  date_key: string;
  created_at: string;
  message_count: number;
}

// ---------- Helpers ----------

function formatSessionDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sessionDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (today.getTime() - sessionDay.getTime()) / 86400000;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function groupSessions(sessions: Session[]) {
  const groups: Record<string, Session[]> = {};
  for (const s of sessions) {
    const label = formatSessionDate(s.created_at);
    if (!groups[label]) groups[label] = [];
    groups[label].push(s);
  }
  return groups;
}

const GREETING: Message = {
  role: 'assistant',
  content: 'Hello! I am Jupid AI. How can I help you with competitor intelligence today?',
};

// ---------- Component ----------

export default function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages]);

  // ---------- Load sessions list ----------
  const loadSessions = useCallback(async () => {
    try {
      const res = await api.get('/chat/sessions');
      setSessions(res.data);
    } catch { /* ignore */ }
  }, []);

  // ---------- Load today's session on mount ----------
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/chat/sessions/today');
        const todaySession: Session = res.data;
        setActiveSession(todaySession);
        // Load its messages
        await loadSessionMessages(todaySession.id);
      } catch { /* no session yet */ }
      await loadSessions();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSessionMessages = async (sessionId: number) => {
    setIsLoadingSession(true);
    try {
      const res = await api.get(`/chat/sessions/${sessionId}/messages`);
      const msgs: Message[] = res.data;
      if (msgs.length === 0) {
        setMessages([GREETING]);
      } else {
        setMessages(msgs);
      }
    } catch {
      setMessages([GREETING]);
    } finally {
      setIsLoadingSession(false);
    }
  };

  // ---------- Switch session ----------
  const switchSession = async (session: Session) => {
    setActiveSession(session);
    await loadSessionMessages(session.id);
  };

  // ---------- New Chat ----------
  const handleNewChat = async () => {
    try {
      const res = await api.post('/chat/sessions');
      const newSession: Session = res.data;
      setSessions(prev => [newSession, ...prev]);
      setActiveSession(newSession);
      setMessages([GREETING]);
    } catch (err) {
      console.error('Could not create session', err);
    }
  };

  // ---------- Send message ----------
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: Message = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await api.post('/chat/', {
        message: userText,
        session_id: activeSession?.id ?? undefined,
      });
      const aiMsg: Message = { role: 'assistant', content: res.data.response };

      // If no active session, adopt the returned one
      if (!activeSession) {
        const sessionRes = await api.get(`/chat/sessions/${res.data.session_id}`).catch(() => null);
        if (sessionRes) setActiveSession(sessionRes.data);
      }

      setMessages(prev => [...prev, aiMsg]);
      // Refresh session list so counts update
      loadSessions();
    } catch {
      const errMsg: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Render ----------
  const grouped = groupSessions(sessions);

  return (
    <MainLayout title="Chat Assistant" fullScreen>
      <div className="flex h-[calc(100vh-56px)] overflow-hidden">

        {/* ===== LEFT: History Sidebar ===== */}
        <aside
          className={`
            ${isSidebarOpen ? 'w-[280px]' : 'w-0'}
            flex-shrink-0 transition-all duration-300 overflow-hidden
            bg-surface border-r border-border-custom flex flex-col
          `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border-custom flex-shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-accent" />
              <span className="text-sm font-bold text-text-primary">Chat History</span>
            </div>
            <button
              id="new-chat-btn"
              onClick={handleNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-primary text-white text-xs font-semibold rounded-xl shadow hover:opacity-90 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus size={14} />
              New Chat
            </button>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-text-muted text-xs gap-2">
                <MessageSquare size={28} className="opacity-30" />
                <p>No history yet</p>
              </div>
            ) : (
              Object.entries(grouped).map(([label, group]) => (
                <div key={label} className="mb-4">
                  <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    {label}
                  </p>
                  {group.map(session => {
                    const isActive = activeSession?.id === session.id;
                    return (
                      <button
                        key={session.id}
                        onClick={() => switchSession(session)}
                        className={`
                          w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-200 group
                          ${isActive
                            ? 'bg-accent/10 border-r-2 border-accent'
                            : 'hover:bg-surface2'}
                        `}
                      >
                        <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                          isActive ? 'bg-accent/20 text-accent' : 'bg-surface2 text-text-muted group-hover:bg-accent/10 group-hover:text-accent'
                        } transition-colors`}>
                          <MessageSquare size={13} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${isActive ? 'text-accent' : 'text-text-primary'}`}>
                            {session.title}
                          </p>
                          <p className="text-[10px] text-text-muted mt-0.5 flex items-center gap-1">
                            <Clock size={9} />
                            {session.message_count} message{session.message_count !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {isActive && <ChevronRight size={14} className="text-accent mt-1 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </aside>

        {/* ===== RIGHT: Chat Area ===== */}
        <div className="flex-1 flex flex-col bg-background overflow-hidden">

          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border-custom bg-surface/80 backdrop-blur-md flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Toggle sidebar button */}
              <button
                onClick={() => setIsSidebarOpen(o => !o)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface2 transition-colors"
                title="Toggle history"
              >
                <MoreVertical size={18} />
              </button>
              <div className="p-2 bg-gradient-primary rounded-xl">
                <Bot className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-sm font-bold text-text-primary">Jupid AI Assistant</h1>
                <p className="text-[10px] text-text-muted">
                  {activeSession ? activeSession.title : 'Always active'} · Powered by Gemini
                </p>
              </div>
            </div>

            {/* New Chat shortcut in header (visible when sidebar closed) */}
            {!isSidebarOpen && (
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-primary text-white text-xs font-semibold rounded-xl shadow hover:opacity-90 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus size={14} />
                New Chat
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">
            {isLoadingSession ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-3 text-text-muted">
                  <Loader2 size={20} className="animate-spin text-accent" />
                  <span className="text-sm">Loading conversation…</span>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border border-border-custom ${
                      message.role === 'user' ? 'bg-surface2 text-accent' : 'bg-gradient-primary text-white'
                    }`}>
                      {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-3xl shadow-sm backdrop-blur-sm ${
                      message.role === 'user'
                        ? 'bg-accent/10 border border-accent/20 text-text-primary rounded-tr-none'
                        : 'bg-surface border border-border-custom text-text-secondary rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Thinking indicator */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-primary text-white flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-surface border border-border-custom text-text-muted p-4 rounded-3xl rounded-tl-none flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-xs font-medium">Assistant is thinking…</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-6 pb-6 pt-2 flex-shrink-0">
            <form
              onSubmit={handleSend}
              className="relative flex items-center gap-2 bg-surface border border-border-custom p-2 pr-3 rounded-2xl shadow-lg focus-within:border-accent/40 transition-all backdrop-blur-md"
            >
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything about competitor intel…"
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-4 resize-none h-12 max-h-32 text-text-primary placeholder:text-text-muted"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-xl transition-all ${
                  input.trim() && !isLoading
                    ? 'bg-gradient-primary text-white shadow-md hover:scale-105 active:scale-95'
                    : 'bg-surface2 text-text-muted cursor-not-allowed'
                }`}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
