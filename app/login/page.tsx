"use client";

import { signIn } from "next-auth/react";
import {
  FaGoogle,
  FaGithub,
  FaGitlab,
  FaXTwitter,
  FaInstagram,
  FaDiscord,
  FaApple,
} from "react-icons/fa6";

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm opacity-60">Sign in to continue</p>
        </div>

        {/* Google (Primary) */}
        <button
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-white text-black py-3 font-medium active:scale-[0.98] transition"
          onClick={() => signIn("google")}
        >
          <FaGoogle className="h-5 w-5" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs opacity-50">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Other Providers */}
        <div className="grid grid-cols-2 gap-3">
          <Provider icon={FaGithub} label="GitHub" />
          {/* <Provider icon={FaGitlab} label="GitLab" />
          <Provider icon={FaXTwitter} label="X" />
          <Provider icon={FaInstagram} label="Instagram" /> */}
          <Provider icon={FaDiscord} label="Discord" />
          {/* <Provider icon={FaApple} label="Apple" /> */}
        </div>

        {/* Footer */}
        <p className="text-center text-xs opacity-50">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

function Provider({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      className="
        flex flex-col items-center justify-center gap-2
        rounded-xl border border-white/10 py-4
        active:scale-[0.97] transition
      "
    >
      <Icon className="h-5 w-5 opacity-80" />
      <span className="text-[11px] opacity-70">{label}</span>
    </button>
  );
}
