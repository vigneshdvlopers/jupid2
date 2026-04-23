'use client';

import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

interface AnalysisResult {
  company: string;
  competitors: string[];
  positioning: string;
  strengths: string[];
  weaknesses: string[];
  comparison: string;
  opportunities: string[];
  threats: string[];
  strategy: string;
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
      // Save for competitors page
      localStorage.setItem('last_analysis', JSON.stringify(data));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <Input 
            label="Enter IT/SaaS Company Name"
            placeholder="e.g. Notion, Slack, Zoom..."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <Button onClick={handleAnalyze} loading={loading}>
          Generate Analysis
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card title="Market Positioning" className="md:col-span-2">
            <p className="text-gray-700 leading-relaxed">{result.positioning}</p>
          </Card>

          <Card title="Strengths">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {result.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Card>

          <Card title="Weaknesses">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {result.weaknesses.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </Card>

          <Card title="Strategic Comparison" className="md:col-span-2">
            <p className="text-gray-700 leading-relaxed">{result.comparison}</p>
          </Card>

          <Card title="Opportunities">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {result.opportunities.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </Card>

          <Card title="Threats">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {result.threats.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </Card>

          <Card title="Recommended Strategy" className="md:col-span-2 bg-blue-50 border-blue-100">
            <p className="text-gray-800 font-medium leading-relaxed italic">
              "{result.strategy}"
            </p>
          </Card>
        </div>
      )}

      {!result && !loading && (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
          <span className="text-4xl mb-2">🔍</span>
          <p>No analysis generated yet. Enter a company name to start.</p>
        </div>
      )}
    </div>
  );
}
