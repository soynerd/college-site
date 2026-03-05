"use client";

import { useScroll, useTransform, motion } from "motion/react";
import { useRef, useState, useMemo, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import SemiCircleGraph from "@/components/SemiCircularGraph";
import { Faculty } from "@prisma/client";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { getUser } from "@/lib/data/getUser";

export default function ParallaxScroll({
  data,
  className,
}: {
  data: Faculty[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /* ---------------- FILTER STATE ---------------- */
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"ALL" | "REGULAR" | "CONTRACT">("ALL");
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewsLeft, setReviewsLeft] = useState<number | null>(null);

  const allDepartments = useMemo(
    () => [...new Set(data.map((f) => f.department))],
    [data],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((f) => {
      const typeOk = type === "ALL" || f.type?.toUpperCase() === type;
      const deptOk =
        selectedDepts.length === 0 || selectedDepts.includes(f.department);
      return typeOk && deptOk;
    });
  }, [data, type, selectedDepts]);
  /* ------------------------------------------------ */

  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -160]);

  const chunk = Math.ceil(filteredData.length / 3);
  const cols = [
    filteredData.slice(0, chunk),
    filteredData.slice(chunk, chunk * 2),
    filteredData.slice(chunk * 2),
  ];
  const motions = [y1, y2, y3];

  useEffect(() => {
    getUser().then((user) => {
      setReviewsLeft(user?.totalReviewsLeft ?? null);
    });
  }, []);

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "h-dvh overflow-y-auto bg-linear-to-br from-zinc-900 via-black to-zinc-900",
          className,
        )}
      >
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 px-2 max-w-6xl mx-auto">
          {cols.map((col, i) => (
            <div key={i} className="grid gap-6">
              {col.map((f, idx) => (
                <Modal key={idx}>
                  <ModalTrigger>
                    <motion.div
                      style={{ y: motions[i] }}
                      className="rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md"
                    >
                      <img
                        src={f.image}
                        alt={f.name}
                        className="h-40 lg:h-64 w-full object-cover"
                      />
                      <div className="p-3">
                        <div className="text-sm font-semibold text-white">
                          {f.name}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {f.department}
                        </div>
                      </div>
                    </motion.div>
                  </ModalTrigger>

                  <ModalBody>
                    <ModalContent>
                      <div className="text-center">
                        <img
                          src={f.image}
                          alt={f.name}
                          className="h-40 w-40 rounded-xl mx-auto mb-4 border border-white/10 object-cover"
                        />
                        <h2 className="text-xl font-semibold text-zinc-100">
                          {f.name}
                        </h2>
                        <p className="text-sm text-zinc-300 mb-4">
                          {f.department}
                        </p>
                        {f.discription &&
                          (() => {
                            const words = f.discription.split(" ");
                            const isLong = words.length > 15;
                            const isExpanded = expandedId === f.id;

                            return (
                              <div className="mb-6">
                                <p className="text-sm text-zinc-300 leading-relaxed">
                                  {isExpanded || !isLong
                                    ? f.discription
                                    : words.slice(0, 15).join(" ") + "..."}
                                </p>

                                {isLong && (
                                  <button
                                    onClick={() =>
                                      setExpandedId(isExpanded ? null : f.id)
                                    }
                                    className="mt-1 text-xs text-blue-400 hover:underline"
                                  >
                                    {isExpanded ? "Less" : "More"}
                                  </button>
                                )}
                              </div>
                            );
                          })()}
                      </div>

                      <div className="relative h-90">
                        <div className="absolute inset-x-0 top-4 space-y-4 px-2 text-zinc-100">
                          <InsightBar
                            label="Fairness in Evaluation"
                            value={f.evaluation}
                          />
                          <InsightBar
                            label="Subject Knowledge"
                            value={f.knowledge}
                          />
                          <InsightBar
                            label="Teaching Clarity & Communication"
                            value={f.clarity_communication}
                          />
                        </div>

                        <SemiCircleGraph f={f} />
                      </div>

                      {reviewsLeft === 0 ? (
                        <button
                          className="w-2/3 mx-auto mt-6 rounded-xl py-3 bg-white text-black font-semibold opacity-75"
                          disabled={reviewsLeft === 0}
                        >
                          Review Quota Over +_+
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            router.push(`faculty-feedback/rate/${f.id}`)
                          }
                          className="w-2/3 mx-auto mt-6 rounded-xl py-3 bg-white text-black font-semibold"
                          disabled={reviewsLeft === 0}
                        >
                          Submit Feedback
                        </button>
                      )}
                    </ModalContent>
                  </ModalBody>
                </Modal>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================= FILTER POPOVER ================= */}
      <div ref={filterRef} className="fixed bottom-20 left-4 z-50">
        <button
          onClick={() => setOpen((v) => !v)}
          className="h-12 w-12 rounded-full bg-zinc-900 border border-white/20
                     grid place-items-center shadow-lg"
        >
          <Filter className="text-white" size={18} />
        </button>

        {open && (
          <div
            className="absolute bottom-14 left-0 w-64 rounded-xl
                          bg-zinc-900 border border-white/10 p-4 shadow-xl"
          >
            <p className="text-xs text-zinc-400 mb-2">Faculty Type</p>
            <div className="flex gap-2 mb-4">
              {["ALL", "REGULAR", "CONTRACT"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs border",
                    type === t
                      ? "bg-white text-black"
                      : "border-white/20 text-zinc-300",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <p className="text-xs text-zinc-400 mb-2">Departments</p>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {allDepartments.map((d) => (
                <label
                  key={d}
                  className="flex items-center gap-2 text-sm text-zinc-300"
                >
                  <input
                    type="checkbox"
                    checked={selectedDepts.includes(d)}
                    onChange={() =>
                      setSelectedDepts((prev) =>
                        prev.includes(d)
                          ? prev.filter((x) => x !== d)
                          : [...prev, d],
                      )
                    }
                  />
                  {d}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* ================================================== */}
    </>
  );
}

function InsightBar({ label, value }: { label: string; value: number }) {
  const percent = Math.min(value / 5, 1) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-zinc-300">
        <span>{label}</span>
        <span className="text-zinc-200">
          {value >= 4.5
            ? "Excellent"
            : value >= 3.5
              ? "Good"
              : value >= 2.5
                ? "Average"
                : "Poor"}
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6 }}
          className="h-full rounded-full bg-linear-to-r from-blue-400 to-cyan-400 "
        />
      </div>
    </div>
  );
}
