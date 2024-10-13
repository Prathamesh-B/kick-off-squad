"use client";

import { signOut } from "next-auth/react";

export function SignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm font-medium underline-offset-4 hover:underline"
    >
      Sign Out
    </button>
  );
}
