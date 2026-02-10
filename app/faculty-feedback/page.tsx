"use client";
import React, { useEffect, useState } from "react";
import ParallaxScroll from "@/components/ui/parallax-scroll";
import BottomNav from "@/components/Navigation";
import { getFaculty } from "@/lib/data/getFaculty";
import { Faculty } from "@prisma/client";
import { FacultyCardSkeleton } from "@/components/Skeletons";

export default function FacultyOverview() {
  const [data, setData] = useState<Faculty[] | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getFaculty();
      console.log(data);
      setData(data);
    })();
  }, []);

  return (
    <div>
      {/* Top Header */}
      <div className="px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white">Faculty Directory</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Browse and explore faculty profiles
        </p>
      </div>

      <div className="h-[calc(100dvh-48px)] overflow-hidden relative">
        {!data ? (
          <div className="grid grid-cols-2 gap-4 p-4 max-w-2xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <FacultyCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ParallaxScroll data={data} />
        )}
      </div>

      <BottomNav />
    </div>
  );
}
