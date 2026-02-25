"use client";

import { useRouter } from "next/navigation";

export default function PlacesAdminPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl text-black font-semibold text-center">
          Manage Places
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/admin/places/manage")}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            View / Manage Places
          </button>

          <button
            onClick={() => router.push("/admin/places/create")}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Create New Place
          </button>
        </div>
      </div>
    </div>
  );
}
