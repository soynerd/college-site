"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FolderOpen, FileText, Download, X } from "lucide-react";
import { SearchSkeleton } from "@/components/Skeletons";
import { User } from "@prisma/client";

export default function SubjectsPage({ user }: { user: User | null }) {
  if (!user)
    return (
      <div className="h-full flex items-center justify-center text-white max-w-2xl mx-auto">
        Please{" `"}
        <a href="/login" className="text-blue-500">
          Login
        </a>
        {"` "}
        to get Resources...
      </div>
    );
  const userId = user.id;

  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  const [degrees, setDegrees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const [selected, setSelected] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    fetch("/api/academic")
      .then((r) => r.json())
      .then((d) => setDegrees(d.degrees));

    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    setLoading(true);
    const res = await fetch(`/api/user-subjects?userId=${userId}`);
    setSaved(await res.json());
    setLoading(false);
  };

  /* ---------------- API ---------------- */
  const handleDegree = async (degreeId: string) => {
    const res = await fetch(`/api/academic?degreeId=${degreeId}`);
    const data = await res.json();
    setDepartments(data.departments);
    setSubjects([]);
  };

  const handleDepartment = async (departmentId: string) => {
    const res = await fetch(`/api/academic?departmentId=${departmentId}`);
    const data = await res.json();
    setSubjects(data.subjects);
  };

  /* ---------------- LOGIC ---------------- */
  const toggle = (s: any) => {
    setSelected((prev) =>
      prev.find((x) => x.id === s.id)
        ? prev.filter((x) => x.id !== s.id)
        : [...prev, s],
    );
  };

  const save = async () => {
    setSaving(true);

    await fetch("/api/user-subjects", {
      method: "POST",
      body: JSON.stringify({
        userId,
        subjectIds: selected.map((s) => s.id),
      }),
    });

    setSaving(false);
    setOpen(false);
    setSelected([]);
    fetchSaved();
  };

  const filterFiles = (files: any[]) => {
    if (filter === "ALL") return files;
    return files.filter((f) => f.contentType === filter);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-4 max-w-2xl mx-auto text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">My Subjects</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 px-3 py-1 rounded-lg text-sm"
        >
          + Add
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-4">
        {["ALL", "NOTES", "PYQ", "SLIDES"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full text-xs ${
              filter === t ? "bg-blue-600" : "bg-zinc-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="space-y-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SearchSkeleton key={i} />)
          : saved.map((item: any) => {
              const isOpen = expanded === item.subject.id;
              const files = filterFiles(item.subject.files);

              return (
                <div
                  key={item.subject.id}
                  className="bg-zinc-900 rounded-xl overflow-hidden transition-all duration-200"
                >
                  {/* Folder Header */}
                  <div
                    onClick={() => setExpanded(isOpen ? null : item.subject.id)}
                    className="flex justify-between items-center p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {isOpen ? <FolderOpen size={18} /> : <Folder size={18} />}
                      <span>{item.subject.name}</span>
                    </div>
                    <span className="text-xs text-zinc-400">
                      {files.length}
                    </span>
                  </div>

                  {/* Files (smooth animation) */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="px-3 pb-3 space-y-2"
                      >
                        {files.map((f: any) => (
                          <motion.div
                            key={f.id}
                            whileTap={{ scale: 0.97 }}
                            className="flex justify-between items-center bg-zinc-800 p-2 rounded-lg"
                          >
                            <div
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => setPreview(f)}
                            >
                              <FileText size={16} />
                              <span className="text-sm">{f.title}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-zinc-700 px-2 py-1 rounded">
                                {f.contentType}
                              </span>
                              <a
                                href={`/api/download?url=${encodeURIComponent(f.url)}&name=${encodeURIComponent(f.title)}`}
                              >
                                <Download size={16} />
                              </a>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
      </div>

      {/* FILE PREVIEW */}
      <AnimatePresence>
        {preview && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-900 w-full h-full md:h-[85%] md:w-[85%] rounded-lg p-3 flex flex-col"
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm">{preview.title}</span>
                <button onClick={() => setPreview(null)}>
                  <X />
                </button>
              </div>

              {/* PDF */}
              {preview.url.endsWith(".pdf") && (
                <iframe src={preview.url} className="w-full flex-1 rounded" />
              )}

              {/* PPTX */}
              {preview.url.endsWith(".pptx") && (
                <iframe
                  src={`https://docs.google.com/gview?url=${preview.url}&embedded=true`}
                  className="w-full flex-1 rounded"
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-end mb-12 max-w-2xl mx-auto">
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            className="bg-zinc-900 w-full rounded-t-2xl p-4 space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold">Select Subjects</h2>

            {/* Degree */}
            <select
              onChange={(e) => handleDegree(e.target.value)}
              className="w-full bg-zinc-800 p-3 rounded-lg"
            >
              <option>Select Degree</option>
              {degrees.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Department */}
            <select
              onChange={(e) => handleDepartment(e.target.value)}
              className="w-full bg-zinc-800 p-3 rounded-lg"
            >
              <option>Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Search */}
            <input
              placeholder="Search subjects..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-800 p-3 rounded-lg"
            />

            {/* Subject chips */}
            <div className="flex flex-wrap gap-2">
              {subjects
                .filter((s) =>
                  s.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map((s) => {
                  const active = selected.find((x) => x.id === s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggle(s)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        active ? "bg-blue-600" : "bg-zinc-800"
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 bg-zinc-800 p-3 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 bg-green-600 p-3 rounded-lg flex justify-center"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
