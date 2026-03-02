"use client";

import { useState, useEffect, useMemo } from "react";
import { MoodSelector } from "@/components/PlaceComponents";
import { FilterChips } from "@/components/PlaceComponents";
import { SortDropdown } from "@/components/PlaceComponents";
import { PlaceCard } from "@/components/PlaceComponents";
import { PlaceDrawer } from "@/components/PlaceComponents";
import { AdvancedFilterModal } from "@/components/PlaceComponents";
import { PlacesSkeleton } from "./Skeletons";
import { motion } from "framer-motion";

export default function Places() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [filters, setFilters] = useState({
    distance: null as string | null,
    budget: null as string | null,
    energy: null as string | null,
    crowd: null as string | null,
  });

  const [sortBy, setSortBy] = useState("distance");

  // ✅ Always fetch fresh data (no cache)
  const fetchPlaces = async () => {
    const res = await fetch("/api/places", {
      cache: "no-store",
    });
    const data = await res.json();
    setPlaces(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // ✅ Keep selectedPlace synced with latest DB data
  const selectedPlace =
    selectedPlaceId !== null
      ? places.find((p) => p.id === selectedPlaceId) || null
      : null;

  const filteredPlaces = useMemo(() => {
    let filtered = [...places];

    if (activeMood) {
      filtered = filtered.filter((p) => p.mood.includes(activeMood));
    }

    if (filters.budget) {
      filtered = filtered.filter((p) => p.budget === filters.budget);
    }

    if (filters.energy) {
      filtered = filtered.filter((p) => p.energy === filters.energy);
    }

    if (filters.crowd) {
      filtered = filtered.filter((p) => p.crowd === filters.crowd);
    }

    if (filters.distance === "0-5") {
      filtered = filtered.filter((p) => p.distanceKm <= 5);
    }

    if (filters.distance === "5-10") {
      filtered = filtered.filter((p) => p.distanceKm > 5 && p.distanceKm <= 10);
    }

    if (sortBy === "distance") {
      filtered.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [places, activeMood, filters, sortBy]);

  const visiblePlaces = filteredPlaces.slice(0, visibleCount);

  // ✅ Rating handler
  const handleRate = async (placeId: number, rating: number) => {
    await fetch(`/api/places/${placeId}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    });

    // Refetch fresh data
    await fetchPlaces();
  };

  if (loading) {
    return <PlacesSkeleton />;
  }

  return (
    <div className="h-full bg-[#0f0f0f] text-white pb-24 overflow-y-auto">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">One-Day Trips</h1>
        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      <MoodSelector activeMood={activeMood} setActiveMood={setActiveMood} />

      <FilterChips
        filters={filters}
        setFilters={setFilters}
        onAdvanced={() => setShowAdvanced(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {visiblePlaces.map((place, i) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <PlaceCard
              place={place}
              visited={!!place.userRating}
              onClick={() => setSelectedPlaceId(place.id)}
            />
          </motion.div>
        ))}
      </div>

      {visibleCount < filteredPlaces.length && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount((v) => v + 6)}
            className="px-6 py-3 bg-white text-black rounded-xl"
          >
            Load More
          </button>
        </div>
      )}
      <AdvancedFilterModal
        open={showAdvanced}
        onClose={() => setShowAdvanced(false)}
        filters={filters}
        setFilters={setFilters}
      />

      <PlaceDrawer
        place={selectedPlace}
        onClose={() => setSelectedPlaceId(null)}
        onRate={handleRate}
      />
    </div>
  );
}
