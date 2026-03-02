"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Place } from "@/lib/types/place";

export function AdvancedFilterModal({ open, onClose, setFilters }: any) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 right-0 bg-[#181818] z-50 rounded-t-3xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Advanced Filters</h2>

            <div className="space-y-4">
              <div>
                <label>Crowd</label>
                <select
                  className="w-full mt-2 bg-black p-2 rounded-lg"
                  onChange={(e) =>
                    setFilters((f: any) => ({ ...f, crowd: e.target.value }))
                  }
                >
                  <option value="">All</option>
                  <option value="Peaceful">Peaceful</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Crowded">Crowded</option>
                </select>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 bg-white text-black py-3 rounded-xl"
            >
              Apply
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function FilterChips({ filters, setFilters, onAdvanced }: any) {
  return (
    <div className="sticky top-0 z-20 bg-[#0f0f0f] py-3 px-4 overflow-x-auto flex justify-center gap-3">
      <SelectChip
        label="📍 Distance"
        value={filters.distance}
        options={[
          { label: "Within 5 km", value: "0-5" },
          { label: "5–10 km", value: "5-10" },
          { label: "10+ km", value: "10+" },
        ]}
        onChange={(val: any) =>
          setFilters((f: any) => ({ ...f, distance: val }))
        }
      />

      <SelectChip
        label="💰 Budget"
        value={filters.budget}
        options={[
          { label: "Free", value: "Free" },
          { label: "Under ₹200", value: "0-200" },
          { label: "₹200–500", value: "200-500" },
          { label: "₹500+", value: "500+" },
        ]}
        onChange={(val: any) => setFilters((f: any) => ({ ...f, budget: val }))}
      />

      <button
        onClick={onAdvanced}
        className="flex flex-row text-xl px-4 py-2 bg-[#181818] rounded-full"
      >
        ⚙
      </button>
    </div>
  );
}

function SelectChip({ label, value, options, onChange }: any) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value || null)}
      className={`px-4 rounded-full bg-[#181818] text-sm ${
        value ? "border border-white" : ""
      }`}
    >
      <option value="">{label}</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

const moods = [
  "Chill",
  "Nature",
  "Food",
  "Adventure",
  "Aesthetic",
  "Spiritual",
];

export function MoodSelector({ activeMood, setActiveMood }: any) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 pb-3">
      {moods.map((mood) => (
        <button
          key={mood}
          onClick={() => setActiveMood(activeMood === mood ? null : mood)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
            activeMood === mood ? "bg-white text-black" : "bg-[#181818]"
          }`}
        >
          {mood}
        </button>
      ))}
    </div>
  );
}

export function PlaceCard({
  place,
  visited,
  onClick,
}: {
  place: Place;
  visited: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative bg-[#181818] rounded-2xl overflow-hidden cursor-pointer border border-transparent hover:border-white/20 transition"
    >
      <div className="relative h-48">
        <Image
          src={place.image}
          alt={place.name}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 bg-black/70 px-3 py-1 rounded-full text-xs">
          📍 {place.distanceKm} km
        </div>

        {place.trending && (
          <div className="absolute top-3 right-3 bg-red-500 text-xs px-2 py-1 rounded-full">
            🔥 Trending
          </div>
        )}

        {visited && (
          <div className="absolute bottom-3 left-3 bg-green-500 text-xs px-3 py-1 rounded-full">
            ✓ Visited
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg">{place.name}</h3>

        <div className="flex items-center gap-2 text-sm">
          ⭐ {place.rating}
          <span className="text-gray-500">({place.ratingCount})</span>
        </div>

        <div className="flex justify-between text-sm text-gray-400">
          <span>⏱ {place.timeRequired}</span>
          <span>💰 {formatBudget(place.budget)}</span>
        </div>

        <div className="flex gap-2 text-xs text-gray-500">
          <span>⚡ {place.energy}</span>
          <span>👥 {place.crowd}</span>
        </div>
      </div>
    </motion.div>
  );
}

function formatBudget(budget: string) {
  switch (budget) {
    case "Free":
      return "Free";
    case "0-200":
      return "Under ₹200";
    case "200-500":
      return "₹200–500";
    case "500+":
      return "₹500+";
    default:
      return budget;
  }
}

export function PlaceDrawer({
  place,
  onClose,
  onRate,
}: {
  place: Place | null;
  onClose: () => void;
  onRate: (id: number, rating: number) => Promise<void>;
}) {
  const [userRating, setUserRating] = useState(0);

  return (
    <AnimatePresence>
      {place && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 120 }}
            className="fixed bottom-0 left-0 right-0 md:right-0 md:left-auto md:top-0 md:bottom-0 md:w-105 bg-[#181818] z-50 rounded-t-3xl md:rounded-none md:rounded-l-3xl p-6 overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-3">{place.name}</h2>

            <p className="text-gray-400 text-sm mb-4">{place.description}</p>

            <div className="space-y-2 text-sm mb-6">
              <div>Distance: {place.distanceKm} km</div>
              <div>Budget: {place.budget}</div>
              <div>Time: {place.timeRequired}</div>
              <div>Energy: {place.energy}</div>
              <div>Crowd: {place.crowd}</div>
            </div>

            {/* ⭐ Rating Section */}
            <div className="mb-6">
              <p className="text-sm mb-2">Rate this place</p>

              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className={`text-2xl ${
                      userRating >= star ? "text-yellow-400" : "text-gray-600"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <button
                disabled={!userRating}
                onClick={() => {
                  onRate(place.id, userRating);
                  setUserRating(0);
                }}
                className="w-full bg-yellow-400 text-black py-3 rounded-xl disabled:opacity-50"
              >
                Submit Rating
              </button>
            </div>

            <a
              href={place.mapsUrl}
              target="_blank"
              className="block text-center bg-white text-black py-3 rounded-xl"
            >
              Open in Google Maps
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function SortDropdown({ sortBy, setSortBy }: any) {
  return (
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="bg-[#181818] px-3 py-2 rounded-lg text-sm"
    >
      <option value="distance">Distance</option>
      <option value="budget">Budget</option>
    </select>
  );
}
