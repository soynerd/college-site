"use client";

import { Home, Search, Bell, User } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Tab } from "@/app/page";
export default function BottomNav() {
  const router = useRouter();

  const items = [
    { id: "home", icon: Home },
    { id: "search", icon: Search },
    { id: "notify", icon: Bell },
    { id: "profile", icon: User },
  ] as const;

  const go = (tab: Tab) => {
    router.replace(`/?tab=${tab}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#0b0f1a]">
      <div className="flex justify-around py-3">
        {items.map(({ id, icon: Icon }) => (
          <motion.button
            key={id}
            whileTap={{ scale: 0.85 }}
            onClick={() => go(id)}
          >
            <Icon size={22} className="text-white/70" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
