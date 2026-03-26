"use client";

import Link from "next/link";
import { MapPin, Users, Image, Compass, Repeat } from "lucide-react";
import { incrementVisit } from "@/lib/data/saveUser";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const actions = [
  {
    title: "Campus Map",
    desc: "See where everyone is",
    href: "/map",
    icon: MapPin,
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Faculty Feedback",
    desc: "Rate & review faculty",
    href: "/faculty-feedback",
    icon: Users,
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "College Memories",
    desc: "Photos & moments",
    href: "/college-memories",
    icon: Image,
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "Places to Visit",
    desc: "Nearby & popular spots",
    href: "/places",
    icon: Compass,
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  // {
  //   title: "Buy · Sell · Exchange",
  //   desc: "For students",
  //   href: "/market",
  //   icon: Repeat,
  //   gradient: "from-rose-500/20 to-red-500/20",
  // },
];

export default function Home() {
  const { data: session } = useSession();
  useEffect(() => {
    incrementVisit();
  });
  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <img
          src={session?.user.image || "https://i.ibb.co/gbJMf9HB/luffy-pfp.jpg"}
          className="h-10 w-10 rounded-full bg-[#1a2035]"
        />
        <div>
          <p className="text-xs opacity-60">Welcome</p>
          <p className="font-semibold dark:text-red-300">{`${session?.user.name?.split(" ")[0]} · Sem ${session?.user.semester ?? "-1"}`}</p>
        </div>
      </div>

      {/* Actions */}
      <section>
        <h2 className="mb-3 text-sm opacity-70">✨ Explore Campus</h2>

        <div className="grid grid-cols-2 gap-3">
          {actions.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`
                rounded-2xl p-4
                bg-linear-to-br ${item.gradient}
                border border-white/10
                active:scale-[0.98]
                transition
              `}
            >
              <item.icon className="h-6 w-6 mb-3 opacity-90" />
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs opacity-60">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
