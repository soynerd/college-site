import Link from "next/link";
import { Folder, Upload, Layers } from "lucide-react";

const adminPages = [
  {
    title: "Manage Files",
    description: "View, edit, or delete uploaded files",
    href: "/admin/resources/files",
    icon: Folder,
  },
  {
    title: "Upload Files",
    description: "Upload new study material",
    href: "/admin/resources/upload",
    icon: Upload,
  },
  {
    title: "Degrees / Departments / Subjects",
    description: "Manage academic structure",
    href: "/admin/resources/structure",
    icon: Layers,
  },
];

export default function AdminHomePage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Manage academic resources and structure
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group relative rounded-2xl border bg-white p-6 shadow-sm transition
                       hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl bg-black text-white flex items-center
                           justify-center group-hover:scale-110 transition"
              >
                <page.icon size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-lg text-black">
                  {page.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {page.description}
                </p>
              </div>
            </div>

            <span
              className="absolute bottom-4 right-6 text-sm opacity-0
                             group-hover:opacity-100 transition"
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
