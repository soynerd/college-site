"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, FileText } from "lucide-react";
import { User } from "@prisma/client";
import { getSubjects } from "@/lib/data/getSubjects";
import { getFiles } from "@/lib/data/getFiles";
import { File } from "@prisma/client";

/* ---------------- types ---------------- */

type Subject = { id: string; name: string };

type Msg = {
  id: string;
  role: "user" | "bot";
  text: string;
  links?: { title: string; url: string }[];
};

/* ---------------- helpers ---------------- */

const bot = (text: string, links?: Msg["links"]): Msg => ({
  id: crypto.randomUUID(),
  role: "bot",
  text,
  links,
});

const userMsg = (text: string): Msg => ({
  id: crypto.randomUUID(),
  role: "user",
  text,
});

/* ---------------- component ---------------- */

export default function ChatPage({ user }: { user: User | null }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);

  /* ---------- localStorage ---------- */

  /* ---------- localStorage ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("academic-chat");

    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        localStorage.removeItem("academic-chat");
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (messages.length === 0) {
      setMessages([
        bot("Hi 👋 Ask me for notes, slides, or PYQs related to your degree."),
      ]);
    }
  }, [hydrated]);

  /* ---------- greet + load subjects ---------- */

  useEffect(() => {
    (async () => {
      if (!user?.degree || !user?.department || !user?.semester) {
        setMessages((m) => [
          ...m,
          bot("⚠️ Please complete your profile to continue."),
        ]);
        return;
      }

      const data = await getSubjects(
        user.degree,
        user.department,
        user.semester,
      );

      setSubjects(
        data?.subjects.map((s) => ({ id: s.id, name: s.name })) || [],
      );
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("academic-chat", JSON.stringify(messages));
  }, [messages, hydrated]);

  /* ---------- scroll ---------- */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- AI CALL ---------- */

  async function callAI(query: string) {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: `
You are an academic assistant.

Rules:
- Choose subject ONLY from provided list
- Choose resource types ONLY from allowed list
- If unclear, ask a clarification question
- Keep answers short
- Respond ONLY in valid JSON
`,
        user: {
          query,
          subjects: subjects.map((s) => s.name),
          allowedTypes: ["notes", "slides", "pyq", "pdf"],
        },
      }),
    });

    return res.json();
  }

  /* ---------- send ---------- */

  async function send() {
    if (!input.trim() || loading) return;
    const query = input;
    setInput("");
    setLoading(true);
    setMessages((m) => [...m, userMsg(query)]);

    if (!subjects.length) {
      setMessages((m) => [...m, bot("Subjects are still loading. Try again.")]);
      setLoading(false);
      return;
    }

    let ai;
    try {
      ai = await callAI(query);
      console.log("AI decision:", ai);
    } catch {
      setMessages((m) => [...m, bot("AI error. Try again.")]);
      setLoading(false);
      return;
    }

    if (ai.needClarification) {
      setMessages((m) => [...m, bot(ai.clarificationQuestion)]);
      setLoading(false);
      return;
    }

    const subject = subjects.find((s) => s.name == ai.subject);
    console.log("subj", subject);
    if (!subject) {
      setMessages((m) => [
        ...m,
        bot("This subject is not available for your semester."),
      ]);
      setLoading(false);
      return;
    }

    const files: File[] = await getFiles(subject.id);
    console.log(files);

    const matched = files.filter((f) =>
      ai.types.includes(f.contentType.toLowerCase()),
    );

    if (!matched.length) {
      setMessages((m) => [...m, bot("No matching resources found.")]);
      setLoading(false);
      return;
    }

    setMessages((m) => [
      ...m,
      bot(
        `📘 ${subject.name}`,
        matched.map((f) => ({
          title: `${f.title} (${f.contentType})`,
          url: f.url,
        })),
      ),
    ]);

    setLoading(false);

    // --- analytics (fire and forget) ---
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        degree: user?.degree,
        department: user?.department,
        semester: user?.semester,
        subject: ai.subject,
        types: ai.types,
        clarified: ai.needClarification,
      }),
    });
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="h-full flex flex-col text-white max-w-3xl mx-auto">
      <h1 className="pt-6 text-center text-xl font-semibold shrink-0">
        Academic Resource Chat
      </h1>

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-y-auto mt-6 space-y-4 pb-4 px-2">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                m.role === "user" ? "ml-auto bg-blue-600" : "bg-zinc-800"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{m.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* INPUT BAR (INSIDE FLOW) */}
      <div className="shrink-0 py-3 bg-black/60 backdrop-blur">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 bg-zinc-900 px-3 py-2 rounded-xl outline-none"
            placeholder="Any Resources related to your degree..."
          />
          <button onClick={send} className="bg-blue-600 px-4 rounded-xl">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
