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
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">AI Analysis Chatbot</h1>
        {currentCompany && (
          <span className="text-sm text-gray-500">Discussing: <strong className="text-blue-600">{currentCompany}</strong></span>
        )}
      </div>

      <Card>
        {!currentCompany && (
            <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 text-sm rounded-md border border-yellow-100">
                Tip: Run an analysis on the Dashboard first to chat about a specific company.
            </div>
        )}
        <ChatBox messages={messages} />
        <div className="flex space-x-2">
          <Input 
            placeholder="Type your question about the analysis..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={!currentCompany || loading}
          />
          <Button onClick={handleSend} loading={loading} disabled={!currentCompany}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
