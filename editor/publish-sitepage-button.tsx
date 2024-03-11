"use client";

import { useState, useTransition } from "react";
import { SitePage } from "@prisma/client";
import { updateSitePageMetadata } from "@/lib/actions";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

type SitePageWithSite = SitePage & { site: { subdomain: string | null } | null };

export default function PublishSitePageButton({ sitePage }: { sitePage: SitePageWithSite }) {
    let [isPendingPublishing, startTransitionPublishing] = useTransition();
    const [data, setData] = useState<SitePageWithSite>(sitePage);

    const url = process.env.NEXT_PUBLIC_VERCEL_ENV
        ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`
        : `http://${data.site?.subdomain}.localhost:3000/${data.slug}`;

    return (
                <button
                    onClick={() => {
                        const formData = new FormData();
                        console.log(data.published, typeof data.published);
                        formData.append("published", String(!data.published));
                        startTransitionPublishing(async () => {
                            await updateSitePageMetadata(formData, sitePage.id, "published").then(() => {
                                toast.success(
                                    `Successfully ${
                                    data.published ? "unpublished" : "published"
                                    } your page.`,
                                );
                                setData((prev) => ({ ...prev, published: !prev.published }));
                            });
                        });
                    }}
                    className={cn(
                        "w-full flex px-4 py-1.5 items-center justify-center space-x-0 rounded-lg border text-sm transition-all focus:outline-none",
                        isPendingPublishing
                            ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                            : data.published
                                ? "text-xs text-stone-600 border-none p-0 underline hover:bg-white hover:text-red-500 active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
                                : "border border-black bg-black text-white hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
                    )}
                    disabled={isPendingPublishing}
                >
                    {isPendingPublishing ? (
                        <LoadingDots />
                    ) : (
                        <p>{data.published ? "Unpublish Page" : "Publish Page"}</p>
                    )}
                    {!isPendingPublishing && data.published && <AlertTriangle className="h-3 mt-[1px]"/>}
                </button>
    );
}