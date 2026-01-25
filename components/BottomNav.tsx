"use client";

import { Home, Search, Bell, User } from "lucide-react";
import { motion } from "framer-motion";
import { Tab } from "@/components/Screen";

type Props = {
  active: Tab;
  setActive: (t: Tab) => void;
};

export default function BottomNav({ active, setActive }: Props) {
  const items = [
    { id: "home", icon: Home },
    { id: "search", icon: Search },
    { id: "notify", icon: Bell },
    { id: "profile", icon: User },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#0b0f1a]">
      <div className="flex justify-around py-3">
        {items.map(({ id, icon: Icon }) => (
          <motion.button
            key={id}
            whileTap={{ scale: 0.85 }}
            onClick={() => setActive(id)}
            className="relative"
          >
            <Icon
              size={22}
              className={active === id ? "text-white" : "text-white/40"}
            />
            {active === id && (
              <motion.div
                layoutId="activeDot"
                className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
