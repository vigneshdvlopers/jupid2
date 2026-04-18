export const dynamic = "force-dynamic";

import React, { Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardContent from './DashboardContent';
import { SkeletonCard } from '@/components/ui/Skeleton';

export default function DashboardPage() {
  return (
    <MainLayout title="Dashboard">
      <Suspense fallback={
        <div className="space-y-8">
          <div className="h-24 w-full bg-surface2 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </MainLayout>
  );
}
