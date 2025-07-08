import React, { Suspense } from 'react';
import Loader from './Loader';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({ children, fallback }) => (
  <Suspense fallback={fallback || <Loader />}>
    {children}
  </Suspense>
);

export default LazyWrapper;