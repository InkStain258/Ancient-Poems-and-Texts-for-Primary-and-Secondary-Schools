import React, { Suspense, lazy } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const WorkListPage = lazy(() => import('./pages/WorkListPage'));
const WorkDetailPage = lazy(() => import('./pages/WorkDetailPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="loading-spinner">
        <span className="text-2xl poem-title text-primary" style={{ position: 'relative', zIndex: 1 }}>诗</span>
      </div>
      <p className="text-muted-foreground animate-pulse text-sm">加载中...</p>
    </div>
  );
}

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'works',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <WorkListPage />
          </Suspense>
        ),
      },
      {
        path: 'works/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <WorkDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'category',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CategoryPage />
          </Suspense>
        ),
      },
      {
        path: 'stats',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <StatsPage />
          </Suspense>
        ),
      },
      {
        path: 'timeline',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TimelinePage />
          </Suspense>
        ),
      },
      {
        path: 'calendar',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CalendarPage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AboutPage />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
