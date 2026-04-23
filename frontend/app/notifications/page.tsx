'use client';

import React from 'react';

export default function Notifications() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
      
      <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="text-4xl mb-4">🔔</div>
        <p className="text-lg font-medium text-gray-500">No new notifications</p>
        <p className="text-sm text-gray-400 mt-2">Check back later for updates on your analyses.</p>
      </div>
    </div>
  );
}
