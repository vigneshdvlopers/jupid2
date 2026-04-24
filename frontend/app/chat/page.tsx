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
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Could not connect to the chat API." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">AI Chatbot</h1>
        {currentCompany && (
          <span className="text-sm text-secondary">
            Context: <strong>{currentCompany}</strong>
          </span>
        )}
      </div>

      <Card className="p-0">
        {!currentCompany && (
            <div className="p-4 m-4 bg-muted text-secondary text-sm rounded">
                Note: Run an analysis on the Dashboard to chat about a specific company.
            </div>
        )}
        
        <ChatBox messages={messages} />
        
        <div className="p-4 border-t border-border bg-white rounded-b-lg">
          <div className="flex gap-2">
            <Input 
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={!currentCompany || loading}
            />
            <Button onClick={handleSend} loading={loading} disabled={!currentCompany || !input}>
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
