"use client";

import { useEffect, useState } from "react";

export default function FacultyAdminPage() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/departments", { cache: "no-store" })
      .then((res) => res.json())
      .then(setDepartments);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/faculty", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      alert("Faculty added successfully");
      e.currentTarget.reset();
      setPreview(null);
    } else {
      alert("Upload failed");
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-12">
      <h1 className="text-2xl font-semibold mb-6">Add Faculty</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <input
            name="name"
            required
            placeholder="Faculty name"
            className="input mt-1"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            name="email"
            type="email"
            required
            placeholder="faculty@iiitbhopal.ac.in"
            className="input mt-1"
          />
        </div>

        {/* Department */}
        <div>
          <label className="text-sm text-gray-600">Department</label>
          <select name="department" required className="input mt-1">
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-gray-600">Description</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Short description"
            className="input mt-1"
          />
        </div>

        {/* Image */}
        <div>
          <label className="text-sm text-gray-600">
            Profile Image
            <p className="text-xs ml-3">&lt;300Kb</p>
          </label>

          <div className="flex items-center gap-4 mt-2">
            {preview ? (
              <img
                src={preview}
                className="w-20 h-20 rounded object-cover border"
              />
            ) : (
              <div className="w-20 h-20 rounded border flex items-center justify-center text-xs text-gray-400">
                Preview
              </div>
            )}

            <label className="cursor-pointer text-sm text-blue-600">
              Choose Image
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="text-sm text-gray-600">Faculty Type</label>
          <select name="type" required className="input mt-1">
            <option value="Regular">Regular</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="btn w-full disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Uploading..." : "Upload Faculty"}
        </button>
      </form>
    </div>
  );
}
