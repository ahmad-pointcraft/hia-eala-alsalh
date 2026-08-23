import type { ReactNode } from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';
import type { SkeletonVariant } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import type { EmptyStateProps } from './EmptyState';

export interface AsyncStateProps {
  /** True while the data is being fetched. */
  loading: boolean;
  /** Non-null when the fetch failed. */
  error: string | null;
  /** True when the fetched collection is empty. */
  isEmpty?: boolean;
  /** Skeleton layout. @default 'list' */
  skeleton?: SkeletonVariant;
  /** Skeleton sizing hints ('list' variant only). */
  skeletonRows?: number;
  /** Skeleton column hint ('list' variant only). */
  skeletonColumns?: number;
  /** Retry handler passed to ErrorState. Required whenever an error is possible. */
  onRetry?: () => void;
  /** Empty-state configuration; title is required whenever `isEmpty` can be true. */
  empty?: EmptyStateProps;
  /** Content rendered once loading/error/empty are all clear. */
  children: ReactNode;
}

/**
 * The single async-state pipeline for admin lists: renders exactly one of
 * skeleton (loading) → error+retry → empty+action → children.
 * Lists either render this component or are `ContentList` (which renders it
 * internally) — never both (no nested state renderers).
 */
export function AsyncState({
  loading,
  error,
  isEmpty = false,
  skeleton = 'list',
  skeletonRows,
  skeletonColumns,
  onRetry,
  empty,
  children,
}: AsyncStateProps) {
  if (loading) {
    return (
      <LoadingSkeleton
        variant={skeleton}
        rows={skeletonRows}
        columns={skeletonColumns}
      />
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry ?? (() => undefined)} />;
  }

  if (isEmpty) {
    return empty ? <EmptyState {...empty} /> : null;
  }

  return <>{children}</>;
}
