import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <main className="flex flex-col items-center justify-center gap-8 py-20 text-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={24}
          priority
          style={{ width: "auto", height: "auto" }}
        />
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-4xl font-bold text-black dark:text-white">
            Fast & Easy URL Shortening
          </h2>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Create short, memorable links and track analytics in real-time. Perfect for sharing, marketing, and management.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {userId ? (
            <a
              className="px-8 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90 transition-opacity"
              href="/dashboard"
            >
              Go to Dashboard
            </a>
          ) : (
            <SignInButton mode="modal">Get Started</SignInButton>
          )}
          <a
            className="px-8 py-3 rounded-lg border border-black dark:border-white text-black dark:text-white font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            href="#features"
          >
            Learn More
          </a>
        </div>
      </main>
    </div>
  );
}
