"use client";

import { useEffect, useState } from "react";
import {
  getSubjectsWithFiles,
  renameFile,
  deleteFileAndR2,
} from "../actions/fileActions";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ---------------- types ---------------- */
type Degree = {
  id: string;
  name: string;
  departments: { id: string; name: string }[];
};

export default function AdminFilesPage() {
  /* ---------- filters ---------- */
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [degreeId, setDegreeId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [semester, setSemester] = useState<number | undefined>();

  /* ---------- data ---------- */
  const [subjects, setSubjects] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  /* ---------- load structure ---------- */
  useEffect(() => {
    fetch("/api/structure")
      .then((r) => r.json())
      .then(setDegrees);
  }, []);

  /* ---------- load files ---------- */
  useEffect(() => {
    getSubjectsWithFiles({
      degreeId,
      departmentId,
      semester,
      page,
    }).then(setSubjects);
  }, [degreeId, departmentId, semester, page]);

  const departments = degrees.find((d) => d.id === degreeId)?.departments || [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Manage Resources</h1>

      {/* ---------------- Filters ---------------- */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border">
        <select
          className="input"
          value={degreeId}
          onChange={(e) => {
            setDegreeId(e.target.value);
            setDepartmentId("");
            setPage(1);
          }}
        >
          <option value="">All Degrees</option>
          {degrees.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={departmentId}
          disabled={!degreeId}
          onChange={(e) => {
            setDepartmentId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={semester ?? ""}
          onChange={(e) => {
            setSemester(e.target.value ? Number(e.target.value) : undefined);
            setPage(1);
          }}
        >
          <option value="">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s}>
              Sem {s}
            </option>
          ))}
        </select>
      </div>

      {/* ---------------- Subjects / Folders ---------------- */}
      <Accordion type="multiple" className="space-y-3">
        {subjects.map((subject) => (
          <AccordionItem
            key={subject.id}
            value={subject.id}
            className="border rounded-xl px-4"
          >
            <AccordionTrigger className="font-medium">
              📁 {subject.name} ({subject.id})
            </AccordionTrigger>

            <AccordionContent className="space-y-2 pb-4">
              {subject.files.length === 0 && (
                <p className="text-sm text-muted-foreground">No files</p>
              )}

              {subject.files.map((file: any) => (
                <FileRow key={file.id} file={file} />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* ---------------- Pagination ---------------- */}
      <div className="flex gap-3 justify-end">
        <button
          className="btn-primary"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <button className="btn-primary" onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

/* ---------------- File Row ---------------- */

function FileRow({ file }: { file: any }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(file.title);

  return (
    <div className="flex items-center justify-between border rounded-lg px-3 py-2">
      <div className="text-sm truncate">{file.title}</div>

      <div className="flex gap-3 text-sm">
        <button onClick={() => setOpen(true)}>Rename</button>

        <a href={file.url} target="_blank" className="text-blue-600">
          View
        </a>

        <button
          className="text-red-600"
          onClick={() => {
            if (confirm("Delete this file permanently?")) {
              deleteFileAndR2(file);
            }
          }}
        >
          Delete
        </button>
      </div>

      {/* Rename Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <h2 className="font-medium mb-2">Rename File</h2>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            className="btn-primary mt-3"
            onClick={() => {
              renameFile(file.id, title);
              setOpen(false);
            }}
          >
            Save
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
