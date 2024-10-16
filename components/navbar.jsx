"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { SignIn } from "./auth/signin-button";
import UserButton from "./user-button";
import { PageLoader } from "./PageLoader";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className="flex h-14 items-center px-4 dark:bg-slate-900 lg:px-6">
      <Link className="flex items-center justify-center" href="/">
        <div className="h-8 w-8 bg-logo-svg bg-cover dark:bg-logo-white-svg"></div>
        <span className="ml-2 text-lg font-bold">Kick-Off Squad</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        {status === "loading" ? (
          <PageLoader type="navbar" />
        ) : user ? (
          <>
            <Link
              className="text-sm font-medium underline-offset-4 hover:underline"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <UserButton user={user} />
          </>
        ) : (
          <>
            <SignIn />
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
