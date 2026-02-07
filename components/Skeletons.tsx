"use client";
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

export function MapSkeleton() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-900">
      {/* shimmer background */}
      <div className="absolute inset-0 animate-pulse bg-linear-to-br from-zinc-800 via-zinc-700 to-zinc-800" />

      {/* fake markers */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-3 w-3 rounded-full bg-blue-500/60"
            style={{
              top: `${10 + Math.random() * 70}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
          />
        ))}
      </div>

      {/* loading text */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-xs text-white">
        Loading map…
      </div>
    </div>
  );
}

export function FacultyCardSkeleton() {
  return (
    <div className="rounded-2xl bg-zinc-900 p-3 shadow-md animate-pulse">
      <div className="h-40 w-full rounded-xl bg-zinc-800 mb-3" />
      <div className="h-4 w-3/4 bg-zinc-800 rounded mb-2" />
      <div className="h-3 w-1/3 bg-zinc-800 rounded" />
    </div>
  );
}

export function FacultySkeleton() {
  return (
    <div className="animate-pulse space-y-6 mt-10 mx-3">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-xl bg-zinc-700" />
        <div className="space-y-2">
          <div className="h-4 w-40 bg-zinc-700 rounded" />
          <div className="h-3 w-28 bg-zinc-600 rounded" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-3 w-full bg-zinc-700 rounded" />
        <div className="h-3 w-full bg-zinc-700 rounded" />
        <div className="h-3 w-full bg-zinc-700 rounded" />
      </div>

      <div className="h-12 w-full bg-zinc-700 rounded-xl" />
    </div>
  );
}
