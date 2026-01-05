import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-gray-200',
        className
      )}
    />
  );
}

export function ListCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <Skeleton className="h-32 w-full rounded-t-xl rounded-b-none" />
      <div className="p-4">
        <Skeleton className="h-5 w-20 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-3 flex gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function PlaceCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <Skeleton className="h-16 w-16 flex-shrink-0 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
