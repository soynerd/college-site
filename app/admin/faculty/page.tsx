import Link from "next/link";
import { Users, PlusCircle } from "lucide-react";

export default function FacultyActionsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Faculty Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View or add faculty details
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/admin/faculty/view"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition"
          >
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
              <Users size={22} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">View Faculty</h2>
              <p className="text-sm text-gray-500">
                See all registered faculty members
              </p>
            </div>
          </Link>

          <Link
            href="/admin/faculty/create"
            className="flex items-center gap-4 p-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white"
          >
            <div className="bg-white/20 p-3 rounded-lg">
              <PlusCircle size={22} />
            </div>
            <div>
              <h2 className="font-semibold">Create Faculty</h2>
              <p className="text-sm text-indigo-100">
                Add a new faculty profile
              </p>
            </div>
          </Link>
        </div>

        {/* Footer hint */}
        <p className="text-xs text-center text-gray-400">Only for Admins</p>
      </div>
    </div>
  );
}
