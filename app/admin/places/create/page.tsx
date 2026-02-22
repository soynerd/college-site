"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function CreatePlacePage() {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    distanceKm: "",
    budget: "",
    timeRequired: "",
    energy: "",
    crowd: "",
    mood: [] as string[],
    trending: false,
    mapsUrl: "",
  });

  const moods = [
    "Chill",
    "Nature",
    "Food",
    "Adventure",
    "Aesthetic",
    "Spiritual",
  ];

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleMood = (mood: string) => {
    setForm((prev) => ({
      ...prev,
      mood: prev.mood.includes(mood)
        ? prev.mood.filter((m) => m !== mood)
        : [...prev.mood, mood],
    }));
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      alert("Please upload image");
      return;
    }

    setLoading(true);

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "mood") {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, String(value));
      }
    });

    data.append("image", imageFile);

    await fetch("/api/places/create", {
      method: "POST",
      body: data,
    });

    setLoading(false);
    alert("Place created successfully");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-8 flex justify-center">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-2xl font-semibold">Add New Place</h1>

        {/* BASIC INFO */}
        <Section title="Basic Info">
          <Input
            label="Place Name"
            value={form.name}
            onChange={(v: any) => handleChange("name", v)}
          />

          {/* Image Upload */}
          {/* Modern Image Upload */}
          <div className="space-y-3">
            <label className="text-sm text-gray-400">Upload Image</label>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file && file.type.startsWith("image/")) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="relative border-2 border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-black/40 hover:border-white/40 transition cursor-pointer"
            >
              {!imagePreview ? (
                <>
                  <div className="text-4xl mb-3">➕</div>
                  <p className="text-sm text-gray-400">
                    Drag & drop image here
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    or click to browse
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              ) : (
                <div className="relative w-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-56 object-cover rounded-xl"
                  />

                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="bg-black/70 px-3 py-1 text-xs rounded-full"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Textarea
            label="Description"
            value={form.description}
            onChange={(v: any) => handleChange("description", v)}
          />
        </Section>

        {/* VISIT DETAILS */}
        <Section title="Visit Details">
          <Input
            label="Distance (km)"
            type="number"
            value={form.distanceKm}
            onChange={(v: any) => handleChange("distanceKm", v)}
          />

          <Select
            label="Budget"
            value={form.budget}
            onChange={(v: any) => handleChange("budget", v)}
            options={["Free", "0-200", "200-500", "500+"]}
          />

          <Select
            label="Time Required"
            value={form.timeRequired}
            onChange={(v: any) => handleChange("timeRequired", v)}
            options={["1-2h", "Half Day", "Full Day"]}
          />

          <Select
            label="Energy Level"
            value={form.energy}
            onChange={(v: any) => handleChange("energy", v)}
            options={["Chill", "Moderate", "Active"]}
          />

          <Select
            label="Crowd Level"
            value={form.crowd}
            onChange={(v: any) => handleChange("crowd", v)}
            options={["Peaceful", "Moderate", "Crowded"]}
          />
        </Section>

        {/* MOOD */}
        <Section title="Mood Tags">
          <div className="flex flex-wrap gap-3">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => toggleMood(mood)}
                className={`px-4 py-2 rounded-full ${
                  form.mood.includes(mood)
                    ? "bg-white text-black"
                    : "bg-[#181818]"
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </Section>

        {/* MAP */}
        <Section title="Map">
          <Input
            label="Google Maps URL"
            value={form.mapsUrl}
            onChange={(v: any) => handleChange("mapsUrl", v)}
          />
        </Section>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Add Place"}
        </motion.button>
      </div>
    </div>
  );
}

/* UI Components (same as before) */
function Section({ title, children }: any) {
  return (
    <div className="space-y-4 bg-[#181818] p-6 rounded-2xl">
      <h2 className="font-semibold text-lg">{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black p-3 rounded-xl border border-white/10"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full bg-black p-3 rounded-xl border border-white/10"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black p-3 rounded-xl border border-white/10"
      >
        <option value="">Select</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
