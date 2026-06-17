'use client';

import { Suspense, lazy, type ComponentProps } from 'react';

/**
 * Lazy-loaded Spline scene wrapper.
 * Spline's @splinetool/react-spline is only loaded when the component
 * is in the viewport and the user hasn't set prefers-reduced-motion.
 */

const Spline = lazy(() =>
  import('@splinetool/react-spline').then((mod) => ({
    default: mod.default,
  }))
);

interface SplineSceneProps {
  sceneUrl: string;
  className?: string;
}

export function SplineScene({ sceneUrl, className }: SplineSceneProps) {
  const commonProps: Partial<ComponentProps<typeof Spline>> = {
    scene: sceneUrl,
    className,
  };

  return (
    <Suspense fallback={null}>
      <Spline {...(commonProps as ComponentProps<typeof Spline>)} />
    </Suspense>
  );
}
