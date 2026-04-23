'use client';

import React, { useEffect, useState } from 'react';
import Card from '../components/Card';

export default function Competitors() {
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [company, setCompany] = useState<string>('');

  useEffect(() => {
    const lastAnalysis = localStorage.getItem('last_analysis');
    if (lastAnalysis) {
      const data = JSON.parse(lastAnalysis);
      setCompetitors(data.competitors || []);
      setCompany(data.company || '');
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Identified Competitors</h1>
        {company && (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            For {company}
          </span>
        )}
      </div>

      {competitors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitors.map((name, index) => (
            <Card key={index} className="hover:border-blue-300 transition-colors cursor-default">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                  {name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{name}</h3>
                  <p className="text-xs text-gray-500">Market Competitor</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
          <span className="text-4xl mb-2">👥</span>
          <p>No competitors found. Run an analysis on the Dashboard first.</p>
        </div>
      )}
    </div>
  );
}
