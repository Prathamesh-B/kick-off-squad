"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { SignIn } from "./auth/signin-button";
import UserButton from "./user-button";

export default function Navbar() {
    const { data: session, status } = useSession();
    const user = session?.user;

    return (
        <header className="px-4 lg:px-6 h-14 flex items-center">
            <Link className="flex items-center justify-center" href="/">
                <Image
                    src="/images/logo.svg"
                    alt="Kick-Off Squad"
                    width={32}
                    height={32}
                />
                <span className="ml-2 text-lg font-bold">Kick-Off Squad</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                {status === "loading" ? (
                    <div>Loading...</div>
                ) : user ? (
                    <>
                        <Link
                            className="text-sm font-medium hover:underline underline-offset-4"
                            href="/dashboard"
                        >
                            Dashboard
                        </Link>
                        <UserButton user={user} />
                    </>
                ) : (
                    <SignIn />
                )}
            </nav>
        </header>
    );
}