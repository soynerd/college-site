"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import { Map, MapPopup } from "@/components/ui/map";
import type { FeatureCollection, Point } from "geojson";
import { useMarkerLayer } from "@/components/MapLayerHook";

interface MarkerData {
  username: string;
  year: number;
  lat: number;
  long: number;
}

interface UserData {
  username: string;
  year: number;
  lat: number;
  long: number;
}

/* ===== REPLACE FROM DB ===== */
const markerData = [
  { username: "alice", year: 2023, lat: 40.748, long: -73.985 },
  { username: "bob", year: 2022, lat: 40.752, long: -73.977 },
  { username: "charlie", year: 2024, lat: 40.743, long: -73.99 },
];

const user = {
  username: "you",
  year: 2025,
  lat: 40.75,
  long: -73.98,
};
/* ========================== */

export default function PeopleMapPage() {
  const years = useMemo(
    () => Array.from(new Set(markerData.map((m) => m.year))).sort(),
    [],
  );

  const [selectedYears, setSelectedYears] = useState<number[]>(years);
  const [open, setOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative h-dvh w-full bg-black">
      <Map center={[-73.98, 40.75]} zoom={11}>
        <PeopleLayer
          markerData={markerData}
          user={user}
          years={selectedYears}
        />
      </Map>

      {/* Filter UI */}
      <div
        ref={filterRef}
        className="absolute bottom-6 right-4 z-30 flex flex-col items-end gap-2"
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col gap-2 mb-2"
            >
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() =>
                    setSelectedYears((prev) =>
                      prev.includes(y)
                        ? prev.filter((v) => v !== y)
                        : [...prev, y],
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selectedYears.includes(y)
                      ? "border-blue-600 border-2 text-white"
                      : "border-zinc-700 text-white "
                  }`}
                >
                  {y}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setOpen((o) => !o)}
          className="h-11 w-11 rounded-full bg-zinc-700 border-blue-600 border-e-2 text-white flex items-center justify-center shadow-lg"
        >
          <Filter size={18} />
        </button>
      </div>
    </div>
  );
}

/* ========= MAP LAYER ========= */
function PeopleLayer({
  markerData,
  user,
  years,
}: {
  markerData: MarkerData[];
  user: UserData;
  years: number[];
}) {
  const geoJson: FeatureCollection<Point, any> = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: [
        ...markerData.map((m) => ({
          type: "Feature" as const,
          properties: { ...m, isUser: false },
          geometry: {
            type: "Point" as const,
            coordinates: [m.long, m.lat],
          },
        })),
        {
          type: "Feature" as const,
          properties: { ...user, isUser: true },
          geometry: {
            type: "Point" as const,
            coordinates: [user.long, user.lat],
          },
        },
      ],
    }),
    [markerData, user],
  );

  const { selected, clear } = useMarkerLayer({
    geoJson,
    years,
  });

  return selected ? (
    <MapPopup
      longitude={selected.lng}
      latitude={selected.lat}
      onClose={clear}
      offset={10}
    >
      <p className="font-medium text-sm text-black">
        {selected.username[0].toUpperCase() + selected.username.slice(1)}
        {selected.isUser && " (You)"}
      </p>
      <p className="text-xs text-zinc-400">Year: {selected.year}</p>
    </MapPopup>
  ) : null;
}
