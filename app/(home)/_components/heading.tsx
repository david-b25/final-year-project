"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import LoadingDots from "@/components/icons/loading-dots";

export default function Heading() {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="font-cal text-3xl sm:text-5xl md:text-6xl font-bold">
        We Bring Your Business Online. Welcome to <span className="underline">SiteUp.</span>
      </h1>
      <div className="my-16"></div>
      <h3 className="font-cal text-base sm:text-xl md:text-2xl font-medium">
        SiteUp is the website builder where <br />
        support is our #1 priority.
      </h3>
      <div className="flex items-center justify-center">
        <Link
          href="/app"
          className="flex items-center space-x-2 rounded-lg border border-black bg-black px-6 py-2 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
        >
          <span className="text-sm font-medium">Get Started</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>
    </div>
  )
};
