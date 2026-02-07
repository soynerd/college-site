"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import BottomNav from "@/components/BottomNav";
import SwipeWrapper from "@/components/SwipeWrapper";
import { PageSkeleton } from "@/components/Skeletons";
import Home from "@/screens/Home";
import { User } from "@prisma/client";

const Search = lazy(() => import("@/screens/Search"));
const Notifications = lazy(() => import("@/screens/Notifications"));
const Profile = lazy(() => import("@/screens/Profile"));

export type Tab = "home" | "search" | "notify" | "profile";

const VALID_TABS: Tab[] = ["home", "search", "notify", "profile"];

export default function Screen({ data }: { data: { user: User | null } }) {
  const params = useSearchParams();
  const router = useRouter();

  const urlTab = params.get("tab") as Tab | null;

  const [active, setActive] = useState<Tab>(
    VALID_TABS.includes(urlTab as Tab) ? urlTab! : "home",
  );

  // sync state ← URL
  useEffect(() => {
    if (urlTab && VALID_TABS.includes(urlTab)) {
      setActive(urlTab);
    }
  }, [urlTab]);

  // sync URL ← state (no scroll, no reload)
  const changeTab = (tab: Tab) => {
    setActive(tab);
    router.replace(`/?tab=${tab}`, { scroll: false });
  };

  // preload screens
  useEffect(() => {
    import("@/screens/Search");
    import("@/screens/Notifications");
    import("@/screens/Profile");
  }, []);

  return (
    <SwipeWrapper active={active} setActive={changeTab}>
      <div className="h-dvh bg-linear-to-br from-zinc-900 via-black to-zinc-900 text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b82f630,transparent_60%)]" />

        <div className="h-[calc(100dvh-48px)] overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full"
            >
              {active === "home" && <Home />}

              <Suspense fallback={<PageSkeleton />}>
                {active === "search" && <Search user={data.user} />}
                {active === "notify" && <Notifications />}
                {active === "profile" && <Profile user={data.user} />}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>

        <BottomNav active={active} setActive={changeTab} />
      </div>
    </SwipeWrapper>
  );
}
