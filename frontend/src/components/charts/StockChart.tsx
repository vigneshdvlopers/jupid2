"use client";
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { StockDataPoint } from '@/types';
import Card from '../ui/Card';

interface StockChartProps {
  ticker: string;
  data: StockDataPoint[];
}

export default function StockChart({ ticker, data }: StockChartProps) {
  const [range, setRange] = useState('1M');
  const ranges = ['1W', '1M', '3M', '6M', '1Y'];

  return (
    <Card className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-text-primary tracking-tight">{ticker} Market Analysis</h3>
          <p className="text-sm text-text-secondary">AI-enhanced real-time performance tracking</p>
        </div>
        <div className="flex bg-surface2 rounded-xl p-1 border border-border-custom">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                range === r ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C6FF7" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#7C6FF7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2E2E45" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B6B85', fontSize: 11 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B6B85', fontSize: 11 }}
              domain={['auto', 'auto']}
              orientation="right"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-surface border border-border-custom px-4 py-3 shadow-2xl rounded-xl backdrop-blur-md bg-opacity-90">
                      <p className="text-[10px] font-bold text-text-muted mb-1 tracking-wider uppercase">{payload[0].payload.date}</p>
                      <p className="text-lg font-bold text-accent">${payload[0].value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#7C6FF7"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#7C6FF7', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-20 w-full mt-6 opacity-30">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Bar dataKey="volume" fill="#2E2E45" radius={[2, 2, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4F8EF7' : '#7C6FF7'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
