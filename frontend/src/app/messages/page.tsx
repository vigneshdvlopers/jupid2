"use client";
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { Message } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { SkeletonMessageCard } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { MessageSquare, Send, Check, Clock } from 'lucide-react';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>();
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/messages/my');
      setMessages(data);
    } catch (err) {
      toast('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim() || newMessage.length > 500) return;
    setSending(true);
    try {
      await api.post('/messages', { message: newMessage });
      toast('Message sent to analysis team', 'success');
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      toast('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <MainLayout title="Communications">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-black text-text-primary tracking-tight">Support & Requests</h2>
          <p className="text-text-secondary font-medium">Coordinate directly with the Jupid AI analyst team</p>
        </div>

        {/* Compose Card */}
        <Card title="New Message">
          <div className="space-y-4">
            <textarea
              placeholder="E.g. Please add XYZ Competitor to my tracking or generate a specific sales report for last quarter..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full min-h-[140px] p-6 bg-surface2 border border-border-custom rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 resize-none font-medium leading-relaxed"
            />
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-black uppercase tracking-widest ${newMessage.length > 500 ? 'text-danger' : 'text-text-muted'}`}>
                {newMessage.length} / 500 CHARACTERS
              </span>
              <Button 
                onClick={handleSend} 
                disabled={!newMessage.trim() || newMessage.length > 500}
                loading={sending}
                className="px-8 h-12"
              >
                SEND MESSAGE <Send size={14} className="ml-2" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Messages List */}
        <div className="space-y-4 pt-12 border-t border-border-custom">
          <h3 className="text-xl font-bold text-text-primary tracking-tight">Recent Correspondence</h3>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <SkeletonMessageCard key={i} />)}
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className="bg-surface/50 border border-border-custom p-6 rounded-2xl group transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-wider bg-surface2 px-2 py-1 rounded-lg">
                      {new Date(m.created_at).toLocaleDateString()} at {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {m.is_read ? (
                      <Badge variant="success">
                        <Check size={10} className="mr-1" /> SEEN BY TEAM
                      </Badge>
                    ) : (
                      <Badge variant="default">
                        <Clock size={10} className="mr-1" /> PENDING REVIEW
                      </Badge>
                    )}
                  </div>
                  <p className="text-text-secondary font-medium leading-relaxed pl-4 border-l-2 border-accent/20">
                    {m.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={MessageSquare}
              heading="No sent messages"
              subheading="You haven't communicated with the team yet. Start a conversation above."
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
