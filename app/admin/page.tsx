"use client";

import Link from "next/link";
import { Folder, Users, MapPin, Trash2, Ban, CreditCard } from "lucide-react";

const TABS = [
  {
    title: "Resources",
    icon: Folder,
    href: "/admin/resources",
    stat: 128,
    grad: "from-blue-600/40 to-cyan-600/40",
  },
  {
    title: "Faculty",
    icon: Users,
    href: "/admin/faculty",
    stat: 42,
    grad: "from-purple-600/40 to-pink-600/40",
  },
  {
    title: "Places to Visit",
    icon: MapPin,
    href: "/admin/places",
    stat: 15,
    grad: "from-emerald-600/40 to-teal-600/40",
  },
  {
    title: "Delete",
    icon: Trash2,
    href: "/admin/delete",
    danger: true,
    grad: "from-orange-600/40 to-amber-600/40",
  },
  {
    title: "Ban User",
    icon: Ban,
    href: "/admin/ban",
    danger: true,
    grad: "from-red-600/40 to-rose-600/40",
  },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#0b0f1a] p-8 text-white">
      <h1 className="text-3xl font-semibold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TABS.map((t) => (
          <Link key={t.title} href={t.href}>
            <div
              className={`relative rounded-2xl p-6 h-36 cursor-pointer
              bg-linear-to-br ${t.grad}
              border border-white/10 backdrop-blur-xl
              hover:scale-[1.03] transition`}
            >
              <t.icon className="h-6 w-6 mb-4" />
              <h2 className="text-lg font-semibold">{t.title}</h2>

              {t.stat !== undefined && (
                <span className="absolute top-4 right-4 text-xs bg-white/20 px-2 py-1 rounded-full">
                  {t.stat}
                </span>
              )}

              {t.danger && (
                <span className="absolute bottom-4 right-4 text-xs text-red-200">
                  Dangerous
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
