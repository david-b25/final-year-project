"use client";

import Link from "next/link";
import Image from "next/image";
import { useScrollTop } from "@/lib/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import {
  ArrowLeft,
  Globe,
  Layout,
  LayoutDashboard,
  Menu,
  Settings,
  Inbox,
  Image as ImageIcon,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { useEffect, useMemo, useState } from "react";


export default function Navbar({ children }: { children: ReactNode }) {
  const scrolled = useScrollTop();
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const [siteId, setSiteId] = useState<string | null>();
  
  const tabs = useMemo(() => {
    if (segments[0] === "site" && id) {
      return [
        {
          name: "Back to All Sites",
          href: "/app",
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Website Pages",
          href: `/app/site/${id}`,
          isActive: !["form", "settings", "assets"].includes(segments[2]),
          icon: <Layout width={18} />,
        },
        {
          name: "Contact Form",
          href: `/app/site/${id}/form`,
          isActive: segments.includes("form"),
          icon: <Inbox width={18} />,
        },
        {
          name: "Media Assets",
          href: `/app/site/${id}/assets`,
          isActive: segments.includes("assets"),
          icon: <ImageIcon width={18} />,
        },
        {
          name: "Settings",
          href: `/app/site/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    } return [
     
    ];
  }, [segments, id]);

  const [showSidebar, setShowSidebar] = useState(false);

  const pathname = usePathname();



  return (
    <div className={cn(
      "z-50 bg-black dark:bg-[#1F1F1F] relative top-0 flex items-center w-full p-6",
      scrolled && "bg-black"
    )}>
      <Link
        href="/"
        className="rounded-lg p-2 hover:bg-stone-200 dark:hover:bg-stone-700"
      >
        <Image
          src="/pixelflow-white.svg"
          width={150}
          height={110}
          alt="Logo"
        />
      </Link>
      <div className="md:ml-auto md:justify-end justify-end w-full flex items-center gap-x-2">
        <div className="flex items-center justify-center">
                {tabs.map(({ name, href, isActive, icon }) => (
                <Link
                    key={name}
                    href={href}
                    className={`flex items-center space-x-3 ${
                    isActive ? "underline" : ""
                    } text-white rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out border border-black hover:border-white active:bg-stone-300`}
                >
                    {icon}
                    <span className="text-sm font-medium">{name}</span>
                </Link>
                ))}

        </div>
        <div className="flex items-center justify-center">
            {children}
        </div>
      </div>
    </div>
  )
}