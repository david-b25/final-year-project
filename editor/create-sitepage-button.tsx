"use client";

import { useModal } from "@/components/modal/provider";
import { ReactNode } from "react";

export default function CreateSiteButton({
  children,
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  return (
    <button
      onClick={() => modal?.show(children)}
      className="w-full rounded-lg border border-black bg-black py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100"
    >
      Create New Page
    </button>
  );
}