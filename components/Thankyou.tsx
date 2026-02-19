"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PiSealCheckFill } from "react-icons/pi";

export default function ThankYouOverlay({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md grid place-items-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-white/10 p-6 text-center space-y-5"
          >
            <div className="text-3xl flex justify-center">
              <PiSealCheckFill />
            </div>
            <h2 className="text-lg font-semibold">
              Thank you for your feedback
            </h2>
            <p className="text-sm text-zinc-400">
              Your response helps other students make better choices.
            </p>

            <div className="flex gap-3 pt-2">
              <Link
                href={"/faculty-feedback"}
                className="flex-1 rounded-xl py-3 bg-white/10 text-white text-sm"
              >
                Return
              </Link>

              <Link
                href={"/"}
                className="flex-1 rounded-xl py-3 bg-white text-black text-sm font-medium text-center"
              >
                Home
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
