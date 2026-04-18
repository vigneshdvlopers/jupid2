"use call";
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '../ui/Card';

interface SalesChartProps {
  competitorName: string;
  clientData: any[];
  competitorData: any[];
}

export default function SalesChart({ competitorName, clientData, competitorData }: SalesChartProps) {
  // Merge data for comparison
  const data = clientData.map((item, idx) => ({
    month: item.month,
    You: item.revenue,
    [competitorName]: competitorData[idx]?.revenue || 0,
  }));

  const clientTotal = clientData.reduce((acc, curr) => acc + curr.revenue, 0);
  const compTotal = competitorData.reduce((acc, curr) => acc + curr.revenue, 0);
  const advantage = clientTotal - compTotal;

  return (
    <Card className="w-full">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-text-primary tracking-tight">Revenue Benchmarking</h3>
        <p className="text-sm text-text-secondary">Comparing your performance against {competitorName}</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-surface2 p-4 rounded-2xl border border-border-custom">
          <p className="text-xs text-text-muted font-bold tracking-wider uppercase mb-1">Your Revenue</p>
          <p className="text-xl font-bold text-text-primary">${(clientTotal / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-surface2 p-4 rounded-2xl border border-border-custom">
          <p className="text-xs text-text-muted font-bold tracking-wider uppercase mb-1">{competitorName}</p>
          <p className="text-xl font-bold text-text-primary">${(compTotal / 1000).toFixed(1)}k</p>
        </div>
        <div className={`p-4 rounded-2xl border ${advantage >= 0 ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20'}`}>
          <p className="text-xs text-text-muted font-bold tracking-wider uppercase mb-1">Advantage</p>
          <p className={`text-xl font-bold ${advantage >= 0 ? 'text-success' : 'text-danger'}`}>
            {advantage >= 0 ? '+' : ''}${(advantage / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2E2E45" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B6B85', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B6B85', fontSize: 11 }} orientation="right" />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-surface border border-border-custom px-4 py-3 shadow-2xl rounded-xl backdrop-blur-md bg-opacity-90">
                      <p className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">{payload[0].payload.month}</p>
                      <div className="space-y-2">
                        {payload.map((p: any) => (
                          <div key={p.name} className="flex items-center gap-10 justify-between">
                            <span className="text-sm text-text-secondary">{p.name}:</span>
                            <span className="text-sm font-bold text-text-primary">${p.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend iconType="circle" />
            <Bar dataKey="You" fill="#7C6FF7" radius={[6, 6, 0, 0]} barSize={24} />
            <Bar dataKey={competitorName} fill="#4F8EF7" radius={[6, 6, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
