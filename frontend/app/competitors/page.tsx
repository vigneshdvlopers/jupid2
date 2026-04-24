'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, RefreshCw, Layers } from 'lucide-react';
import CompetitorCard from '../components/competitors/CompetitorCard';

const CompetitorsPage = () => {
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const lastAnalysis = localStorage.getItem('last_analysis');
    if (lastAnalysis) {
      const data = JSON.parse(lastAnalysis);
      setCompetitors(data.competitors || []);
    }
  }, []);

  const filteredCompetitors = competitors.filter(c => 
    c.toLowerCase().includes(search.toLowerCase())
  );

  // Mock descriptions and scores for the premium feel
  const getMockData = (name: string) => ({
    description: `${name} is a primary market player focused on digital transformation and cloud-native solutions with a strong footprint in enterprise SaaS.`,
    score: Math.floor(Math.random() * (98 - 75 + 1)) + 75,
    strengths: ["Market Reach", "Technical Stack", "Brand Equity", "Agile Flow"]
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 text-primary-accent mb-2">
            <Layers size={20} />
            <span className="font-bold uppercase tracking-widest text-xs">Competitive Landscape</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Identified Competitors</h1>
          <p className="text-text-secondary mt-1">Benchmarking the industry leaders and emerging threats.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search rivals..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-accent/10 focus:border-primary-accent text-sm w-64 shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white border border-border rounded-xl text-text-secondary hover:bg-hover-surface transition-colors shadow-sm">
            <Filter size={18} />
          </button>
          <button className="p-2.5 bg-white border border-border rounded-xl text-text-secondary hover:bg-hover-surface transition-colors shadow-sm">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredCompetitors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitors.map((name, index) => {
            const mock = getMockData(name);
            return (
              <CompetitorCard 
                key={index}
                name={name}
                description={mock.description}
                score={mock.score}
                strengths={mock.strengths}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-border">
          <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-4">
            <Layers size={32} className="opacity-20 text-primary-accent" />
          </div>
          <h3 className="text-xl font-bold text-text-primary">No Rivals Detected</h3>
          <p className="text-text-muted text-center max-w-xs mt-2">
            Run a market analysis on the dashboard to populate your competitive landscape.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompetitorsPage;
