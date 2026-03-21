"use client";

import { useEffect, useRef, useState } from "react";

const CONTENT_TYPES = ["notes", "slides", "pyq", "lab", "book"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

type Degree = {
  id: string;
  name: string;
  departments: { id: string; name: string }[];
};

type Subject = { id: string; name: string };

export default function UploadPage() {
  /* ---------- structure ---------- */
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [degreeId, setDegreeId] = useState("");
  const [departments, setDepartments] = useState<Degree["departments"]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [semester, setSemester] = useState<number | "">("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState("");

  /* ---------- metadata ---------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [contentType, setContentType] = useState("notes");

  /* ---------- file ---------- */
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  /* ---------- fetch degree ---------- */
  useEffect(() => {
    fetch("/api/admin/structure")
      .then((r) => r.json())
      .then(setDegrees);
  }, []);

  /* ---------- update departments ---------- */
  useEffect(() => {
    const d = degrees.find((d) => d.id === degreeId);
    setDepartments(d?.departments || []);
    setDepartmentId("");
    setSubjects([]);
    setSubjectId("");
  }, [degreeId]);

  /* ---------- fetch subjects ---------- */
  useEffect(() => {
    if (!departmentId || !semester) return;
    fetch(`/api/subjects?departmentId=${departmentId}&semester=${semester}`)
      .then((r) => r.json())
      .then(setSubjects);
  }, [departmentId, semester]);

  /* ---------- file select ---------- */
  function onFileSelect(f: File) {
    if (f.size > MAX_SIZE) {
      setError("File must be less than 10MB");
      setFile(null);
      return;
    }

    setError("");
    setFile(f);
    setTitle(f.name);
  }

  /* ---------- upload ---------- */
  function upload() {
    if (!file || !subjectId) return;
    if (file.size > MAX_SIZE) return;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);
    fd.append("description", description);
    fd.append("academicYear", academicYear);
    fd.append("subjectId", subjectId);
    fd.append("contentType", contentType);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => setProgress(100);
    xhr.send(fd);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Upload Resource</h1>

      <div className="space-y-5 bg-white border rounded-2xl p-6 shadow-sm">
        {/* Degree / Dept / Sem / Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="input"
            value={degreeId}
            onChange={(e) => setDegreeId(e.target.value)}
          >
            <option value="">Select Degree</option>
            {degrees.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={departmentId}
            disabled={!departments.length}
            onChange={(e) => setDepartmentId(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
          >
            <option value="">Select Semester</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={subjectId}
            disabled={!subjects.length}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* File drop */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50"
        >
          {file ? (
            <p className="font-medium">{file.name}</p>
          ) : (
            <p className="text-gray-500">Click or drag file here</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={(e) => e.target.files && onFileSelect(e.target.files[0])}
          />
        </div>

        {/* Metadata */}
        <div className="space-y-3">
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />

          <textarea
            className="input min-h-20"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
          />

          <input
            className="input"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            placeholder="Academic Year (e.g. 2023-24)"
          />
        </div>

        {/* Content type */}
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setContentType(t)}
              className={`px-3 py-1 rounded-full text-sm ${
                contentType === t ? "bg-black text-white" : "border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Progress */}
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded">
            <div
              className="bg-blue-600 text-xs text-white text-center rounded"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}

        {/* Upload */}
        <button
          onClick={upload}
          disabled={!file || !subjectId}
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
        >
          Upload
        </button>
      </div>

      {/* Tailwind helper */}
      <style jsx>{`
        .input {
          border: 1px solid #e5e7eb;
          padding: 0.6rem;
          border-radius: 0.5rem;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
