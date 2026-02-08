"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Faculty = {
  id: number;
  name: string;
  department: string;
  type: string;
  image: string;
};

export default function FacultyListPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [typeFilter, setTypeFilter] = useState<"all" | "Regular" | "Contract">(
    "all",
  );
  const [deptFilter, setDeptFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/faculty/view")
      .then((res) => res.json())
      .then((data) => setFaculty(data))
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(() => {
    return Array.from(new Set(faculty.map((f) => f.department)));
  }, [faculty]);

  const filteredFaculty = useMemo(() => {
    return faculty.filter((f) => {
      const typeMatch = typeFilter === "all" ? true : f.type === typeFilter;
      const deptMatch =
        deptFilter === "all" ? true : f.department === deptFilter;
      return typeMatch && deptMatch;
    });
  }, [faculty, typeFilter, deptFilter]);

  async function deleteFaculty(id: number) {
    if (!confirm("Delete this faculty permanently?")) return;

    setDeletingId(id);
    await fetch(`/api/admin/faculty/${id}`, { method: "DELETE" });
    setFaculty((prev) => prev.filter((f) => f.id !== id));
    setDeletingId(null);
  }

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading faculty…</div>
    );
  }

  return (
    <div className="">
      <div className="space-y-6 max-w-4xl mx-auto mt-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center max-w-xl mx-auto">
          {/* Type */}
          <div className="flex gap-1 rounded border p-1">
            {["all", "Regular", "Contract"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t as any)}
                className={`px-3 py-1 text-sm rounded ${
                  typeFilter === t ? "bg-black text-white" : "hover:bg-gray-100"
                }`}
              >
                {t === "all" ? "All" : t}
              </button>
            ))}
          </div>

          {/* Department */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="input max-w-xs"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* List */}
        {filteredFaculty.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No faculty found
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFaculty.map((f) => (
              <div
                key={f.id}
                className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={f.image}
                    alt={f.name}
                    className="h-14 w-14 rounded-full object-cover border"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{f.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {f.department} • {f.type}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/faculty/${f.id}`}
                    className="btn flex-1 text-center"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteFaculty(f.id)}
                    disabled={deletingId === f.id}
                    className="btn flex-1 text-red-600 disabled:opacity-60"
                  >
                    {deletingId === f.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
