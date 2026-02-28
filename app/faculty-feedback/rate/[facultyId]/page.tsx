"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getFaculty } from "@/lib/data/faculty";
import { Faculty } from "@prisma/client";
import { FacultySkeleton } from "@/components/Skeletons";
import ThankYouOverlay from "@/components/Thankyou";

const TRAITS = [
  { key: "reader", label: "📽 Reads PPT" },
  { key: "commonSense", label: "🧠 “This is common sense” person" },
  { key: "storyteller", label: "📖 Storyteller teacher" },
  { key: "strictPookie", label: "😈 Try-hard strict but Pookie" },
  { key: "assignmentFreak", label: "📝 Assignment Freak" },
  { key: "researchRecruiter", label: "🔬 Academic recruiter for research" },
  { key: "newtonEinstein", label: "💩 Taught Newton & Einstein" },
  { key: "twoMinutes", label: "⏳ '2 minutes' = 20 minutes" },
  { key: "callsStudents", label: "🎤 Calls students randomly" },
];

export default function FacultyRatePage() {
  const { facultyId } = useParams<{ facultyId: string }>();

  const [fairness, setFairness] = useState(3);
  const [knowledge, setKnowledge] = useState(3);
  const [clarity, setClarity] = useState(3);
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [category, setCategory] = useState<
    "goat" | "passable" | "sleepInducer" | "Unbearable" | null
  >(null);
  const [traits, setTraits] = useState<Record<string, boolean>>({
    pptOnly: false,
  });
  const [loader, setLoader] = useState<boolean>(false);
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    (async () => {
      const d = await getFaculty(facultyId);
      console.log(d);
      setFaculty(d);
    })();
  }, [facultyId]);

  function toggleTrait(key: string) {
    setTraits((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSubmit() {
    if (!category) return;
    setLoader(true);

    await fetch("/api/faculty/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        facultyId,
        fairness,
        knowledge,
        clarity,
        category,
        traits,
      }),
    })
      .then((res) => res.json())
      .then((data) => (data.error && alert(data.error)) || setShowThanks(true));
  }

  return !faculty ? (
    <FacultySkeleton />
  ) : (
    <div className="h-dvh bg-linear-to-br from-zinc-900 via-black to-zinc-900 text-white px-4 py-6 overflow-y-auto">
      <div className="max-w-md mx-auto space-y-8">
        {/* Faculty header */}
        <div className="flex items-center gap-4">
          <img
            src={faculty.image}
            alt={faculty.name}
            className="h-16 w-16 rounded-xl object-cover border border-white/10"
          />
          <div>
            <div className="font-semibold">{faculty.name}</div>
            <div className="text-sm text-zinc-400">{faculty.department}</div>
          </div>
        </div>
        {/* Sliders */}
        <Section title="Teaching Evaluation">
          <Slider
            label="Fairness in Evaluation"
            value={fairness}
            setValue={setFairness}
          />
          <Slider
            label="Subject Knowledge"
            value={knowledge}
            setValue={setKnowledge}
          />
          <Slider
            label="Teaching Clarity & Communication"
            value={clarity}
            setValue={setClarity}
          />
        </Section>
        {/* Category */}
        <Section title="Overall Experience">
          <div className="grid grid-cols-2 gap-3">
            {[
              ["goat", "🔥 GOAT"],
              ["passable", "🙂 Passable"],
              ["sleepInducer", "😴 Sleep Inducer"],
              ["Unbearable", "💀 Unbearable"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setCategory(key as any)}
                className={`rounded-xl py-3 text-sm font-medium transition ${
                  category === key
                    ? "bg-white text-black"
                    : "bg-white/5 border border-white/10 text-zinc-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Section>
        {/* Traits */}
        <Section title="Teaching Style">
          <div className="space-y-3">
            {TRAITS.map((t) => (
              <ToggleRow
                key={t.key}
                label={t.label}
                active={traits[t.key] || false}
                onClick={() => toggleTrait(t.key)}
              />
            ))}
          </div>
        </Section>
        {/* Submit */}
        {!loader ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleSubmit}
            className="w-full rounded-xl py-4 bg-white text-black font-semibold"
          >
            Submit Feedback
          </motion.button>
        ) : (
          <motion.button disabled className="opacity-70">
            <span className="inline-flex justify-center items-center gap-2 w-full">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
              Submitting…
            </span>
          </motion.button>
        )}
      </div>
      <ThankYouOverlay open={showThanks} />
    </div>
  );
}

function Slider({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-zinc-300">
        <span>{label}</span>
        <span className="text-zinc-400">{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={5}
        step={0.1}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-white"
      />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-zinc-200">{title}</h2>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3">
      <span className="text-sm text-zinc-300">{label}</span>
      <button
        onClick={onClick}
        className={`w-12 h-6 rounded-full relative transition ${
          active ? "bg-red-500" : "bg-zinc-600"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
            active ? "right-0.5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
