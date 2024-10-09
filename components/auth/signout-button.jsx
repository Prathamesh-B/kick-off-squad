"use client";

import { signOut } from "next-auth/react";

export function SignOut() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm font-medium hover:underline underline-offset-4"
        >
            Sign Out
        </button>
    );
}