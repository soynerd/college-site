"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, FileText, X } from "lucide-react";

/* -------- utils -------- */
function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

/* -------- mock data -------- */
const notifications = [
  {
    id: 1,
    title: "New OS Notes Uploaded",
    desc: "Process Scheduling – PDF added",
    details:
      "Detailed OS notes on Process Scheduling are now available. Includes algorithms, examples, and exam-oriented explanations.",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    icon: FileText,
  },
  {
    id: 2,
    title: "DBMS Resources Updated",
    desc: "Normalization short notes available",
    details:
      "Updated DBMS normalization notes with clear 1NF–BCNF explanations and solved questions.",
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
    icon: FileText,
  },
  {
    id: 3,
    title: "AI Basics",
    desc: "New intro slides uploaded",
    details:
      "Beginner-friendly AI slides covering history, applications, and basic terminology.",
    createdAt: Date.now() - 1000 * 60 * 60 * 60,
    icon: Bell,
  },
];

export default function Notifications() {
  const [open, setOpen] = useState<any>(null);

  return (
    <div className="relative h-full overflow-hidden bg-linear-to-br from-zinc-900 via-black to-zinc-900 text-white">
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b82f630,transparent_60%)]" />

      {/* Page enter animation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative h-full px-4 pt-6 pb-24 max-w-3xl mx-auto"
      >
        <h1 className="text-xl font-semibold mb-4">Notifications</h1>

        {/* Notification list */}
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <motion.button
              key={n.id}
              onClick={() => setOpen(n)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 24,
                delay: i * 0.05,
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left flex gap-3 rounded-2xl bg-zinc-800/80 backdrop-blur px-4 py-3"
            >
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
                <n.icon size={18} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-zinc-400">{n.desc}</p>
              </div>

              <span className="text-xs text-zinc-500">
                {timeAgo(n.createdAt)}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              onClick={() => setOpen(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-zinc-900 px-5 pt-4 pb-8"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-zinc-400">
                  {timeAgo(open.createdAt)}
                </p>
                <button onClick={() => setOpen(null)}>
                  <X size={18} />
                </button>
              </div>

              <h2 className="text-lg font-semibold mb-2">{open.title}</h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {open.details}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
