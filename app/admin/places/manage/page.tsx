"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ManagePlacesPage() {
  const router = useRouter();

  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchPlaces() {
      const res = await fetch("/api/places");
      const data = await res.json();
      setPlaces(data);
      setLoading(false);
    }

    fetchPlaces();
  }, []);

  const filteredPlaces = useMemo(() => {
    if (!search) return places;

    return places.filter((place) =>
      place.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, places]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-8 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold">Manage Places</h1>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search place by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#181818] p-4 rounded-2xl border border-white/10 focus:border-white outline-none"
          />
        </div>

        {/* Places List */}
        <div className="space-y-3">
          {filteredPlaces.length === 0 && (
            <div className="text-gray-500 text-sm">No places found.</div>
          )}

          {filteredPlaces.map((place, i) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => router.push(`/admin/places/manage/${place.id}`)}
              className="flex items-center justify-between bg-[#181818] p-4 rounded-2xl cursor-pointer hover:bg-[#222] transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={place.image}
                  className="w-16 h-16 object-cover rounded-xl"
                />

                <div>
                  <div className="font-semibold">{place.name}</div>
                  <div className="text-xs text-gray-400">
                    📍 {place.distanceKm} km • ⭐ {place.rating}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-400">Edit →</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
