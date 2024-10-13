"use client";

import { signIn } from "next-auth/react";

export function SignIn() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="text-sm font-medium underline-offset-4 hover:underline"
    >
      Sign in
    </button>
  );
}
