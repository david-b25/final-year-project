"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { PageType } from "@prisma/client";
import CreatePageType from "@/components/create-pagetype";

export default function SiteSettingsNav({pageTypes}: {pageTypes: PageType[]}) {
  const { id } = useParams() as { id?: string };
  const segment = useSelectedLayoutSegment();

  return (
    <div className="flex space-x-4 border-b border-stone-200 pb-4 pt-2 overflow-x-auto whitespace-nowrap">
      <Link
        href={`/app/site/${id}`}
          className={cn(
            "rounded-md px-2 py-1 text-sm font-medium transition-colors active:bg-stone-200",
            segment === null
              ? "bg-stone-100 text-stone-600 "
              : "text-stone-600 hover:bg-stone-100 ",
          )}
        >
          Main Pages
      </Link>
      <div className="border-l border-stone-200 mx-4" />
      <CreatePageType />
      {pageTypes.map((item) => (
        <Link
          key={item.id}
          href={`/app/site/${id}/${item.slug}`}
          className={cn(
            "capitalize rounded-md px-2 py-1 text-sm font-medium transition-colors active:bg-stone-200",
            segment === item.slug
              ? "bg-stone-100 text-stone-600 "
              : "text-stone-600 hover:bg-stone-100 ",
          )}
        >
          {item.title}
        </Link>
      )
      )}
    </div>
  );
}