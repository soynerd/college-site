"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, FileText } from "lucide-react";

type Msg = {
  id: string;
  role: "user" | "bot";
  text: string;
  links?: { title: string; url: string }[];
};

const SUBJECTS = [
  "Data Structures",
  "Operating System",
  "DBMS",
  "Computer Networks",
  "AI Basics",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "intro",
      role: "bot",
      text: "Ask me about any subject. I’ll give you the **best resources + PDFs**.",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // ✅ track pending timeouts
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  const send = (text: string) => {
    if (!text.trim()) return;

    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text }]);
    setInput("");

    const id = window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: `Here are top resources for **${text}**`,
          links: [
            {
              title: `${text} – Complete Notes (PDF)`,
              url: "https://example.com/sample.pdf",
            },
            {
              title: `${text} – Reference Book`,
              url: "https://example.com/book.pdf",
            },
          ],
        },
      ]);
    }, 600);

    timeoutsRef.current.push(id);
  };

  return (
    <div className="relative mb-20 h-full bg-linear-to-br from-zinc-900 via-black to-zinc-900 text-white overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b82f630,transparent_60%)]" />

      {/* ✅ PAGE BOUNCE (ONLY ONCE) */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 18,
          mass: 0.9,
        }}
        className="relative h-full flex flex-col max-w-3xl mx-auto px-4"
      >
        {/* Header */}
        <div className="pt-6 pb-4 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Academic Resource Chat
          </h1>
          <p className="text-sm text-zinc-400">
            PDFs • Notes • Best explanations
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-32">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "ml-auto bg-blue-600"
                    : "bg-zinc-800/80 backdrop-blur"
                }`}
              >
                <p className="text-sm leading-relaxed">{m.text}</p>

                {m.links && (
                  <div className="mt-3 space-y-2">
                    {m.links.map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        className="flex items-center gap-2 text-sm bg-black/40 hover:bg-black/60 transition rounded-lg px-3 py-2"
                      >
                        <FileText size={16} />
                        {l.title}
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Subject Quick Picks */}
        <div className="absolute bottom-24 left-0 right-0 px-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="whitespace-nowrap text-sm px-4 py-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black to-transparent">
          <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur rounded-2xl px-3 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask for notes, PDFs, explanations..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button
              onClick={() => send(input)}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
