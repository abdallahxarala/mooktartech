"use client";

import { Suspense } from 'react';
import { MainLayout } from '@/components/layouts/main-layout';
import { Loading } from '@/components/layouts/loading';

interface LayoutClientProps {
  children: React.ReactNode;
  locale: string;
  translations: any;
}

export function LayoutClient({ children, locale, translations }: LayoutClientProps) {
  return (
    <div className="locale-container">
      <MainLayout>
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </MainLayout>
    </div>
  );
}