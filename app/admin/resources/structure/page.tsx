"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createDegree,
  createDepartment,
  createSubject,
  getDegreees,
  getSubjects,
} from "./actions";

export default function StructurePage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [degrees, setDegrees] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  async function load() {
    setDegrees(await getDegreees());
    setSubjects(await getSubjects());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-semibold">Academic Structure</h1>

      {/* Add Degree */}
      <Card title="Add Degree">
        <Form
          onSubmit={(fd: any) =>
            startTransition(async () => {
              await createDegree(fd.get("name") as string);
              await load();
            })
          }
        />
      </Card>

      {/* Add Department */}
      <Card title="Add Department">
        <Form
          onSubmit={(fd: any) =>
            startTransition(async () => {
              await createDepartment(
                fd.get("name") as string,
                fd.get("degreeId") as string,
              );
              await load();
            })
          }
        >
          <select name="degreeId" className="input" required>
            {degrees.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Form>
      </Card>

      {/* Add Subject */}
      <Card title="Add Subject">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            startTransition(async () => {
              await createSubject(
                fd.get("name") as string,
                fd.getAll("departments") as string[],
                Number(fd.get("semester")),
              );
              await load();
            });
          }}
        >
          <input
            name="name"
            required
            className="input"
            placeholder="Subject name"
          />

          <select name="semester" className="input" required>
            <option value="">Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>

          <div className="max-h-40 overflow-y-auto border rounded p-2">
            {degrees.flatMap((deg) =>
              deg.departments.map((dep: any) => (
                <label key={dep.id} className="block text-sm">
                  <input
                    type="checkbox"
                    name="departments"
                    value={dep.id}
                    className="mr-2"
                  />
                  {deg.name} / {dep.name}
                </label>
              )),
            )}
          </div>

          <button className="btn-primary" disabled={pending}>
            {pending ? "Adding..." : "Add Subject"}
          </button>
        </form>
      </Card>

      {/* View */}
      <Card title="Subjects">
        {subjects.map((s) => (
          <div key={s.id} className="text-sm border-b py-1">
            <b>{s.name}</b> (Sem {s.semester}) →{" "}
            {s.departments.map((d: any) => d.department.name).join(", ")}
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ---------- helpers ---------- */

function Card({ title, children }: any) {
  return (
    <div className="border rounded-xl p-5 space-y-3 bg-white shadow-sm">
      <h2 className="font-medium text-lg">{title}</h2>
      {children}
    </div>
  );
}

function Form({ onSubmit, children }: any) {
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
        e.currentTarget.reset();
      }}
    >
      <input name="name" required className="input" placeholder="Name" />
      {children}
      <button className="btn-primary">Add</button>
    </form>
  );
}
