'use client';

import React from 'react';
import Card from '../components/Card';

const notifications = [
  { id: 1, title: 'New Competitor Found', message: 'Waymo has been identified as a new competitor for your last analysis.', time: '2 hours ago', type: 'info' },
  { id: 2, title: 'Analysis Complete', message: 'The deep analysis for the company "Notion" has been completed successfully.', time: '5 hours ago', type: 'success' },
  { id: 3, title: 'Market Shift Alert', message: 'A significant market shift was detected in the Collaborative Software sector.', time: '1 day ago', type: 'warning' },
  { id: 4, title: 'Service Update', message: 'Jupid AI backend has been updated to version 1.2 with improved scraping.', time: '2 days ago', type: 'info' },
];

export default function Notifications() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
      
      <div className="space-y-4">
        {notifications.map((n) => (
          <Card key={n.id} className="relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              n.type === 'success' ? 'bg-green-500' : 
              n.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{n.title}</h3>
                <p className="text-gray-600 mt-1 text-sm">{n.message}</p>
                <span className="text-xs text-gray-400 mt-2 block">{n.time}</span>
              </div>
              <button className="text-gray-300 hover:text-gray-500">✕</button>
            </div>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-white rounded-lg border border-gray-100">
          <p>No new notifications at this time.</p>
        </div>
      )}
    </div>
  );
}
