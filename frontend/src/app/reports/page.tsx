export const dynamic = "force-dynamic";

import React, { Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ReportsContent from './ReportsContent';
import Card from '@/components/ui/Card';
import { SkeletonTable } from '@/components/ui/Skeleton';

export default function ReportsPage() {
  return (
    <MainLayout title="Reports">
      <Suspense fallback={<Card><SkeletonTable rows={8} /></Card>}>
        <ReportsContent />
      </Suspense>
    </MainLayout>
  );
}
