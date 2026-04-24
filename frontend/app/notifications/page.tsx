'use client';

import React from 'react';
import Card from '../components/Card';

export default function Notifications() {
  const notifications = [
    { id: 1, title: 'Analysis Complete', message: 'The analysis for Notion has been generated successfully.', time: '2 hours ago' },
    { id: 2, title: 'New Feature', message: 'Chatbot context is now preserved across sessions.', time: '1 day ago' },
    { id: 3, title: 'System Update', message: 'Backend engine updated to v2.4 for faster results.', time: '3 days ago' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Notifications</h1>
      
      <div className="space-y-4">
        {notifications.map((n) => (
          <Card key={n.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-foreground">{n.title}</h3>
                <p className="text-sm text-secondary mt-1">{n.message}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{n.time}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
