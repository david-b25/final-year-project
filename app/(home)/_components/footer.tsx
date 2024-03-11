import Image from "next/image";
import Link from "next/link";


export default function Footer() {
  return (
    <div className="w-full bg-black">
      <div className="flex items-center w-full p-6 pb-2 bg-black z-50">
        <Link
          href="/"
          className="rounded-lg p-2 border border-black hover:border-white"
        >
          <Image
            src="/logo-white.svg"
            width={110}
            height={110}
            alt="Logo"
            className="dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
          />
        </Link>
        <div className="md:ml-auto w-full justify-end md:justify-end flex items-center gap-x-2 text-muted-foreground">
            <Link href="/privacy" className="font-cal text-sm text-white rounded-lg p-2 hover:bg-white hover:text-black">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-cal text-sm text-white rounded-lg p-2 hover:bg-white hover:text-black">
              Terms & Conditions
            </Link>
        </div>
      </div>
      <div className="flex-row items-center justify-center pb-8 px-6">
        <div className="w-full h-[1px] mb-4 bg-white bg-opacity-40"></div>
        <p className="font-cal text-xs text-white text-center">
          © Copyright 2024 Graft Marketing. All Rights Reserved.
        </p>
      </div>
    </div>
  )
};