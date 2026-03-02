"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function EditPlacePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    async function fetchPlace() {
      const res = await fetch("/api/places");
      const data = await res.json();
      const place = data.find((p: any) => p.id == id);

      setForm(place);
      setImagePreview(place.image);
      setLoading(false);
    }

    fetchPlace();
  }, [id]);

  if (loading || !form) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const handleSubmit = async () => {
    setSaving(true);

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "mood") {
        data.append(key, JSON.stringify(value));
      }
      // ❌ DO NOT append image from form
      else if (key !== "image") {
        data.append(key, String(value));
      }
    });

    // ✅ Only append real file
    if (imageFile) {
      data.append("image", imageFile);
    }

    await fetch(`/api/admin/places/${id}`, {
      method: "PUT",
      body: data,
    });

    setSaving(false);
    router.push("/admin/places/manage");
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this place?",
    );
    if (!confirmDelete) return;

    await fetch(`/api/admin/places/${id}`, {
      method: "DELETE",
    });

    router.push("/admin/places/manage");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-8 flex justify-center">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-2xl font-semibold">Edit Place</h1>

        {/* IMAGE */}
        <div className="space-y-3">
          <label className="text-sm text-gray-400">Update Image</label>

          <div className="relative border-2 border-dashed border-white/20 rounded-2xl p-4">
            {imagePreview && (
              <img
                src={imagePreview}
                className="w-full h-56 object-cover rounded-xl"
              />
            )}

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
          </div>
        </div>

        {/* BASIC INPUTS */}
        {[
          "name",
          "distanceKm",
          "budget",
          "timeRequired",
          "energy",
          "crowd",
          "mapsUrl",
        ].map((field) => (
          <div key={field} className="space-y-2">
            <label className="text-sm text-gray-400 capitalize">{field}</label>
            <input
              value={form[field]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [field]: e.target.value,
                })
              }
              className="w-full bg-black p-3 rounded-xl border border-white/10"
            />
          </div>
        ))}

        {/* BUTTONS */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSubmit}
          disabled={saving}
          className="w-full bg-white text-black py-4 rounded-xl font-semibold"
        >
          {saving ? "Saving..." : "Update Place"}
        </motion.button>

        <button
          onClick={handleDelete}
          className="w-full bg-red-600 py-4 rounded-xl font-semibold"
        >
          Delete Place
        </button>
      </div>
    </div>
  );
}
