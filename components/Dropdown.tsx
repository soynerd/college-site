"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Dropdown({ label, value, options, onChange, disabled }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>

      <button
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex justify-between items-center rounded-xl bg-zinc-800 px-4 py-3 text-sm disabled:opacity-50"
      >
        <span>{value || "Select"}</span>
        <ChevronDown
          size={16}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute z-50 mt-2 w-full rounded-xl bg-zinc-900 border border-zinc-700 overflow-hidden"
          >
            {options.map((o: any) => (
              <button
                key={o.id}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800"
              >
                {o.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
