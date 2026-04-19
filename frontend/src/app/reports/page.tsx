export const dynamic = "force-dynamic";

import React, { Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ReportsContent from './ReportsContent';
import Card from '@/components/ui/Card';
import { SkeletonTable } from '@/components/ui/Skeleton';

export default function ReportsPage() {
  return (
    <Suspense fallback={
      <MainLayout title="Reports">
        <Card><SkeletonTable rows={8} /></Card>
      </MainLayout>
    }>
      <MainLayout title="Reports">
        <ReportsContent />
      </MainLayout>
    </Suspense>
  );
}
