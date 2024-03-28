"use client"
import Footer from "./_components/footer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
      <header className="relative flex items-center justify-center h-screen overflow-hidden">
      <div className="flex flex-col items-center justify-center relative z-30 md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <div className="max-w-3xl space-y-4">
          <h1 className="font-cal text-white text-3xl sm:text-5xl md:text-6xl font-bold">
              Introducing PixelFlow: Creating Websites from Text
          </h1>
          <div className="my-16"></div>
          <h3 className="font-cal text-white text-base sm:text-xl md:text-2xl font-medium">
            PixelFlow is not just Text to Wesbite, it is Text to Functional Website.
          </h3>
          <div className="flex items-center justify-center">
            <Link
              href="/app"
              className="flex items-center space-x-2 rounded-lg border border-white bg-black px-6 py-2 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
            >
              <span className="text-sm font-medium">Get Started</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
        <div className="absolute inset-0 -z-10 min-w-full min-h-full max-w-none items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
        </div>
      </header>
      <Footer />
    </div>
  );
}
