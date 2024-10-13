import { Calendar, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 justify-center">
        <section className="w-full bg-hero-img bg-cover bg-fixed bg-bottom py-12 md:bg-center md:py-24 lg:py-32 xl:py-48">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 rounded-md bg-black/50 py-6 text-center md:py-12">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Kick-Off Squad
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Manage your football events, register for matches, and get
                  auto-generated balanced teams based on player skills.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                  href="/dashboard"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-slate-100 py-12 dark:bg-slate-900 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:grid-cols-2 md:gap-16">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-200 p-2 dark:bg-slate-500">
                  <Calendar className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">Easy Registration</h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Class members can quickly sign up for events, indicating their
                  availability and skill level.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-200 p-2 dark:bg-slate-500">
                  <Users className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">Smart Team Generation</h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our algorithm automatically creates balanced teams based on
                  player skills, ensuring fair and competitive matches.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
