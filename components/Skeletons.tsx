export function CardSkeleton() {
  return (
    <div className="min-w-35 rounded-xl bg-[#1a2035] p-4 animate-pulse">
      <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
      <div className="h-3 w-1/2 bg-white/10 rounded" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div className="h-6 w-1/3 bg-white/10 rounded animate-pulse" />
      <div className="flex gap-3">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
