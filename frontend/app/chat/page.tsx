'use client';

import React, { useState, useEffect } from 'react';
import ChatBox from '../components/ChatBox';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentCompany, setCurrentCompany] = useState('');

  useEffect(() => {
    const lastAnalysis = localStorage.getItem('last_analysis');
    if (lastAnalysis) {
      setCurrentCompany(JSON.parse(lastAnalysis).company);
    }
  }, []);

  const handleSend = async () => {
    if (!input || !currentCompany) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          company: currentCompany,
          message: input 
        }),
      });

      if (!response.ok) throw new Error('Chatbot failed to respond.');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a processing anomaly. Please verify your connection to the intelligence core." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">Intelligence Chat</h1>
          <p className="mt-2 text-muted-foreground text-lg">Query the AI core for deep-dive competitor insights.</p>
        </div>
        {currentCompany && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-muted rounded-full border border-border">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Active Analysis: <span className="text-primary">{currentCompany}</span></span>
          </div>
        )}
      </div>

      <Card variant="default" className="p-0 overflow-hidden border-none shadow-xl bg-white/50 backdrop-blur-sm">
        {!currentCompany && (
            <div className="m-6 p-4 bg-primary/5 text-primary text-sm rounded-lg border border-primary/10 flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tip: Execute a company analysis on the Dashboard to enable contextual intelligence.
            </div>
        )}
        
        <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">System Ready</span>
            </div>
            <button 
                onClick={() => setMessages([])} 
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
                Clear Log
            </button>
        </div>

        <ChatBox messages={messages} />
        
        <div className="p-6 bg-white dark:bg-card border-t border-border">
          <div className="relative flex items-center">
            <Input 
              placeholder="Ask about pricing trends, feature gaps, or market sentiment..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={!currentCompany || loading}
              className="pr-32 py-4 text-base"
            />
            <div className="absolute right-2">
                <Button 
                    onClick={handleSend} 
                    loading={loading} 
                    disabled={!currentCompany || !input}
                    className="h-10 px-6"
                >
                    Query AI
                </Button>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-40">
                Processed by Jupid Intelligence Core v2.4.0
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
