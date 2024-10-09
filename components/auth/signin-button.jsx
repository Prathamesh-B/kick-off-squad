"use client";

import { signIn } from "next-auth/react";

export function SignIn() {
    return (
        <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="text-sm font-medium hover:underline underline-offset-4"
        >
            Sign in
        </button>
    );
}