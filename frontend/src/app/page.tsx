"use client";

export const dynamic = "force-dynamic";
import React, { Suspense } from 'react';
import DashboardContent from './dashboard/DashboardContent';

export default function RootPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
