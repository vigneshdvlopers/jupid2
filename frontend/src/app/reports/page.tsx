export const dynamic = "force-dynamic";

import React, { Suspense } from 'react';
import ReportsContent from './ReportsContent';

export default function ReportsPage() {
  return (
    <Suspense fallback={null}>
      <ReportsContent />
    </Suspense>
  );
}
