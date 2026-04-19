export const dynamic = "force-dynamic";

import React, { Suspense } from 'react';
import DashboardContent from './DashboardContent';

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
