'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  MoreHorizontal,
  Command,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentCompany, setCurrentCompany] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastAnalysis = localStorage.getItem('last_analysis');
    if (lastAnalysis) {
      setCurrentCompany(JSON.parse(lastAnalysis).company);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input || !currentCompany || loading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: currentCompany, message: input }),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Our intelligence core is currently recalibrating. Please try again shortly." }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What are their pricing gaps?",
    "Analyze their latest product pivot",
    "How to outmaneuver their enterprise strategy?",
    "Summarize their technical debt"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-white rounded-[2.5rem] border border-border shadow-xl shadow-black/5 overflow-hidden">
      {/* Chat Header */}
      <div className="px-8 py-4 border-b border-border bg-surface/30 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-primary-accent flex items-center justify-center text-white shadow-lg shadow-primary-accent/20">
            <Bot size={22} />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">Intelligence Core</h3>
            <p className="text-[10px] font-bold text-soft-accent uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-1.5 bg-soft-accent rounded-full mr-1.5 animate-pulse" /> Live Synthesis
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
            {currentCompany && (
                <div className="px-3 py-1 bg-white border border-border rounded-full text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    Context: {currentCompany}
                </div>
            )}
            <button className="p-2 hover:bg-hover-surface rounded-lg transition-colors">
                <MoreHorizontal size={20} className="text-text-muted" />
            </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-8">
            <div className="w-20 h-20 rounded-[2.5rem] bg-surface flex items-center justify-center">
              <Sparkles size={40} className="text-primary-accent opacity-20" />
            </div>
            <div className="text-center space-y-2">
              <h4 className="text-xl font-bold text-text-primary tracking-tight">Direct Intelligence Link</h4>
              <p className="text-text-muted text-sm max-w-sm">Query the AI core for deep-dive strategic insights into {currentCompany || 'your market rivals'}.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(s)}
                  className="p-4 text-left bg-surface hover:bg-hover-surface border border-border rounded-2xl transition-all group"
                >
                  <p className="text-xs font-bold text-text-primary group-hover:text-primary-accent transition-colors flex items-center">
                    {s} <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={cn(
              "flex items-end space-x-3",
              msg.role === 'user' ? "flex-row-reverse space-x-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
              msg.role === 'user' ? "bg-dark-base text-white" : "bg-primary-accent text-white"
            )}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={cn(
              "max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-dark-base text-white rounded-br-none" 
                : "bg-surface text-text-primary border border-border rounded-bl-none shadow-sm"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-end space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary-accent text-white flex items-center justify-center shrink-0">
              <Bot size={14} />
            </div>
            <div className="bg-surface border border-border p-4 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-primary-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-primary-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-primary-accent rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 border-t border-border bg-surface/20">
        {!currentCompany && (
            <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-xl flex items-center space-x-3 text-warning">
                <Command size={18} />
                <p className="text-xs font-bold uppercase tracking-wider">Operational Constraint: Analysis Required to initialize context.</p>
            </div>
        )}
        <div className="relative group">
          <input 
            type="text" 
            placeholder={currentCompany ? `Query intelligence on ${currentCompany}...` : "Context inactive..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={!currentCompany || loading}
            className="w-full pl-6 pr-16 py-4 bg-white border border-border rounded-2xl outline-none focus:ring-4 focus:ring-primary-accent/5 focus:border-primary-accent transition-all text-sm shadow-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input || loading || !currentCompany}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary-accent text-white rounded-xl shadow-lg shadow-primary-accent/20 hover:bg-dark-base transition-all disabled:opacity-30 disabled:shadow-none"
          >
            <Send size={18} fill="currentColor" />
          </button>
        </div>
        <p className="mt-4 text-center text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-50">
            Jupid Intelligence Protocol v4.0.1 • Enterprise Tier
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
