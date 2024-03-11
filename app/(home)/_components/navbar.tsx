"use client";

import Link from "next/link";
import Image from "next/image";
import { useScrollTop } from "@/lib/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";


export default function Navbar() {
  const scrolled = useScrollTop();

  return (
    <div className={cn(
      "z-50 bg-none dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
      scrolled && "bg-black"
    )}>
      <Link
        href="/"
        className="rounded-lg p-2 hover:bg-stone-200 dark:hover:bg-stone-700"
      >
        <Image
          src="/PixelFlow-white.svg"
          width={150}
          height={110}
          alt="Logo"
          className="dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
        />
      </Link>
      <div className="md:ml-auto md:justify-end justify-end w-full flex items-center gap-x-2">
        <div className="flex items-center justify-center">
          <Link
            href="/app"
            className="flex items-center space-x-2 rounded-lg border border-white bg-black px-6 py-2 text-sm font-medium text-white transition-all hover:bg-white hover:text-black"
          >
            <span className="text-sm font-medium">Get Started</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}