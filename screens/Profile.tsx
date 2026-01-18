"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  LogOut,
  Trash2,
  X,
  Check,
  Sun,
  Moon,
  Laptop,
  MapPin,
} from "lucide-react";

/* ---------- helpers ---------- */
function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

/* ---------- theme ---------- */
function applyTheme(theme: "light" | "dark" | "system") {
  const root = document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    root.classList.add(prefersDark ? "dark" : "light");
  } else {
    root.classList.add(theme);
  }
}

/* ---------- mock user ---------- */
const user = {
  name: "Naveen Kumar",
  email: "naveen@gmail.com",
  role: "Student",
  joinedAt: 1735689600000,
  lastLogin: Date.now() - 1000 * 60 * 60 * 2,
  provider: "Google",
  photo: "/avatar.png",
};

/* ---------- completion ---------- */
function completion(f: any) {
  const fields = [
    f.displayName,
    f.username,
    f.branch,
    f.department,
    f.semester,
    f.year,
    f.Lat,
    f.Long,
    f.photo,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export default function Profile() {
  const initialForm = {
    displayName: user.name,
    username: "",
    branch: "",
    department: "",
    semester: "",
    year: "",
    Lat: "",
    Long: "",
    photo: user.photo,
    theme: "system" as "light" | "dark" | "system",
    notifications: true,
  };

  const [form, setForm] = useState(initialForm);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locError, setLocError] = useState("");

  /* apply theme */
  useEffect(() => {
    applyTheme(form.theme);
  }, [form.theme]);

  /* dirty state */
  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form]
  );

  const percent = completion(form);

  /* image preview */
  const onImage = (file: File) =>
    setForm({ ...form, photo: URL.createObjectURL(file) });

  /* ---------- auto location fetch ---------- */
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocError("");
        const { latitude, longitude } = pos.coords;
        setForm({
          ...form,
          Lat: latitude.toFixed(2),
          Long: longitude.toFixed(2),
        });
      },
      () => setLocError("Location permission denied")
    );
  };

  /* save */
  const saveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
  };

  const cancelChanges = () => setForm(initialForm);

  return (
    <div className="relative h-full bg-linear-to-br from-zinc-900 via-black to-zinc-900 text-white overflow-y-auto">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b82f630,transparent_60%)]" />

      {/* page bounce */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 16,
          bounce: 0.25,
        }}
        className="relative max-w-3xl mx-auto px-4 pt-6 pb-32"
      >
        {/* header */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="relative rounded-full p-0.75"
            style={{
              background: `conic-gradient(#3b82f6 ${percent}%, #27272a 0)`,
            }}
          >
            <div className="rounded-full bg-black p-1">
              <img
                src={form.photo}
                className="h-24 w-24 rounded-full object-cover"
              />
            </div>
            <label className="absolute bottom-1 right-1 p-2 rounded-full bg-zinc-800 cursor-pointer">
              <Camera size={14} />
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && onImage(e.target.files[0])}
              />
            </label>
          </div>

          <p className="mt-3 text-sm text-zinc-400">
            Profile completion • {percent}%
          </p>

          <h2 className="mt-2 text-lg font-semibold">{form.displayName}</h2>

          <span className="mt-1 text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-400">
            {user.role}
          </span>

          <p className="mt-2 text-xs text-zinc-500">{user.email}</p>
        </div>

        {/* profile */}
        <Section title="Profile">
          <Input
            label="Display name"
            value={form.displayName}
            onChange={(v: any) => setForm({ ...form, displayName: v })}
          />
          <Input
            label="Username"
            hint="Can be changed only once"
            value={form.username}
            onChange={(v: any) => setForm({ ...form, username: v })}
          />

          <TwoCol>
            <Input
              label="Branch"
              value={form.branch}
              onChange={(v: any) => setForm({ ...form, branch: v })}
            />
            <Input
              label="Department"
              value={form.department}
              onChange={(v: any) => setForm({ ...form, department: v })}
            />
          </TwoCol>

          <TwoCol>
            <Input
              label="Semester"
              value={form.semester}
              onChange={(v: any) => setForm({ ...form, semester: v })}
            />
            <Input
              label="Year"
              value={form.year}
              onChange={(v: any) => setForm({ ...form, year: v })}
            />
          </TwoCol>

          <TwoCol>
            <Input
              label="Lat"
              value={form.Lat}
              onChange={(v: any) => setForm({ ...form, Lat: v })}
            />
            <Input
              label="Long"
              value={form.Long}
              onChange={(v: any) => setForm({ ...form, Long: v })}
            />
          </TwoCol>

          <button
            onClick={fetchLocation}
            className="flex items-center gap-1 text-xs text-blue-400 pl-2"
          >
            <MapPin size={14} /> Use current location
          </button>

          {locError && <p className="mt-1 text-xs text-red-400">{locError}</p>}
        </Section>

        {/* account info */}
        <Section title="Account info">
          <Info label="Joined" value={formatDate(user.joinedAt)} />
          <Info label="Last login" value={timeAgo(user.lastLogin)} />
          <Info label="Login method" value={user.provider} />
        </Section>

        {/* settings */}
        <Section title="Settings">
          <ThemePicker
            value={form.theme}
            onChange={(v: any) => setForm({ ...form, theme: v })}
          />
        </Section>

        {/* actions */}
        <Section>
          <button className="w-full py-3 rounded-xl bg-zinc-800">
            Upload resources
          </button>

          <button className="w-full flex gap-2 justify-center items-center py-3 rounded-xl bg-zinc-800 mt-3">
            <LogOut size={16} /> Logout
          </button>
        </Section>

        {/* danger */}
        <Section title="Danger zone">
          <button
            onClick={() => setDeleteOpen(true)}
            className="w-full flex gap-2 justify-center items-center py-3 rounded-xl bg-red-600/20 text-red-400"
          >
            <Trash2 size={16} /> Delete account
          </button>
        </Section>
      </motion.div>

      {/* save bar */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className="fixed bottom-16 left-4 right-4 z-50 rounded-2xl bg-zinc-900/90 backdrop-blur px-4 py-3 flex justify-between items-center"
          >
            <p className="text-sm text-zinc-400">Unsaved changes</p>
            <div className="flex gap-2">
              <button
                onClick={cancelChanges}
                className="p-2 rounded-xl bg-zinc-700"
              >
                <X size={18} />
              </button>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="p-2 rounded-xl bg-blue-600 disabled:opacity-50"
              >
                <Check size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* delete confirm */}
      <AnimatePresence>
        {deleteOpen && (
          <>
            <motion.div
              onClick={() => setDeleteOpen(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-zinc-900 px-5 pt-4 pb-8"
            >
              <div className="flex justify-between mb-3">
                <h3 className="font-semibold">Delete account</h3>
                <X onClick={() => setDeleteOpen(false)} />
              </div>
              <p className="text-sm text-zinc-400 mb-4">
                This action is irreversible.
              </p>
              <button className="w-full py-3 rounded-xl bg-red-600 text-white">
                Confirm delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- UI helpers ---------- */

const Section = ({ title, children }: any) => (
  <div className="mb-6">
    {title && <p className="mb-3 text-xs uppercase text-zinc-500">{title}</p>}
    <div className="space-y-3">{children}</div>
  </div>
);

const TwoCol = ({ children }: any) => (
  <div className="grid grid-cols-2 gap-3">{children}</div>
);

const Input = ({ label, value, onChange, hint }: any) => (
  <div>
    <label className="text-xs text-zinc-400">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full rounded-xl bg-zinc-800 px-4 py-3 text-sm outline-none"
    />
    {hint && <p className="text-xs text-zinc-500 mt-1">{hint}</p>}
  </div>
);

const Info = ({ label, value }: any) => (
  <div className="flex justify-between text-sm">
    <span>{label}</span>
    <span className="text-zinc-500">{value}</span>
  </div>
);

const ThemePicker = ({ value, onChange }: any) => {
  const options = [
    { id: "system", icon: Laptop, label: "System" },
    { id: "dark", icon: Moon, label: "Dark" },
    { id: "light", icon: Sun, label: "Light" },
  ];

  return (
    <div>
      <p className="text-xs text-zinc-400 mb-2">Theme</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl border ${
              value === o.id
                ? "border-blue-600 bg-blue-600/10"
                : "border-zinc-700 bg-zinc-800"
            }`}
          >
            <o.icon size={16} />
            <span className="text-xs">{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
