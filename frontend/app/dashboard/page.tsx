'use client';

import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

interface AnalysisResult {
  company: string;
  positioning: string;
  strengths: string[];
  weaknesses: string[];
  strategy: string;
  competitors: string[];
}

export default function Dashboard() {
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!company) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/company/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze company. Please try again.');
      }
      
      const data = await response.json();
      setResult(data);
      localStorage.setItem('last_analysis', JSON.stringify(data));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
        <h1 className="text-xl font-bold mb-4">Competitor Analysis</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input 
              placeholder="Enter company name (e.g. Notion)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <Button onClick={handleAnalyze} loading={loading} className="whitespace-nowrap">
            Analyze
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <Card title="Market Positioning">
            <p className="text-secondary leading-relaxed">{result.positioning}</p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Strengths">
              <ul className="list-disc list-inside space-y-2 text-secondary">
                {result.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </Card>

            <Card title="Weaknesses">
              <ul className="list-disc list-inside space-y-2 text-secondary">
                {result.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </Card>
          </div>

          <Card title="Strategy">
            <p className="text-secondary leading-relaxed">{result.strategy}</p>
          </Card>
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-20 text-secondary border-2 border-dashed border-border rounded-lg bg-white">
          <p>Enter a company name above to generate an AI analysis.</p>
        </div>
      )}
    </div>
  );
}
