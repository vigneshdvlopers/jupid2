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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Identified Competitors</h1>
        {company && (
          <span className="text-sm text-secondary">
            Analysis for: <strong>{company}</strong>
          </span>
        )}
      </div>

      {competitors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.map((name, index) => (
            <Card key={index} className="p-4">
              <div className="font-medium text-foreground">{name}</div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-secondary border-2 border-dashed border-border rounded-lg bg-white">
          <p>No competitors found. Run an analysis on the Dashboard first.</p>
        </div>
      )}
    </div>
  );
}
