"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Faculty = {
  id: number;
  name: string;
  email: string;
  department: string;
  discription: string;
  type: string;
  image: string;
  imageFile?: File;
  imagePreview?: string;
};

export default function EditFacultyPage() {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<Faculty | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const f = await fetch(`/api/admin/faculty/${id}`).then((r) => r.json());
      setData(f);

      const d = await fetch("/api/departments").then((r) => r.json());
      setDepartments(d);
    }

    load();
  }, [id]);

  async function updateFaculty(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !data) return;

    setSaving(true);

    const form = new FormData();
    form.append("name", data.name);
    form.append("email", data.email);
    form.append("department", data.department);
    form.append("discription", data.discription);
    form.append("type", data.type);

    if (data.imageFile) {
      form.append("image", data.imageFile);
    }

    await fetch(`/api/admin/faculty/${id}`, {
      method: "PUT",
      body: form,
    });

    setSaving(false);
    alert("Faculty updated");
  }

  if (!data) return <p className="p-6 text-gray-500">Loading…</p>;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-6">Edit Faculty</h1>

      <form onSubmit={updateFaculty} className="space-y-4">
        {/* Image */}
        <div>
          <label className="text-sm text-gray-600">Profile Image</label>
          <div className="flex gap-4 items-center mt-2">
            <img
              src={data.imagePreview || data.image}
              className="w-25 h-25 rounded object-cover border"
            />
            <label className="cursor-pointer text-blue-600 text-sm">
              Change
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setData({
                    ...data,
                    imageFile: file,
                    imagePreview: URL.createObjectURL(file),
                  });
                }}
              />
            </label>
          </div>
        </div>

        <input
          className="input"
          placeholder="Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <input
          className="input"
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <select
          className="input"
          value={data.department}
          onChange={(e) => setData({ ...data, department: e.target.value })}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <textarea
          className="input"
          placeholder="Description"
          value={data.discription}
          onChange={(e) => setData({ ...data, discription: e.target.value })}
        />

        <select
          className="input"
          value={data.type}
          onChange={(e) => setData({ ...data, type: e.target.value })}
        >
          <option value="Regular">Regular</option>
          <option value="Contract">Contract</option>
        </select>

        <button disabled={saving} className="btn w-full cursor-pointer mt-3">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
