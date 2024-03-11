"use client";

import { useState, useTransition } from "react";
import { SitePage } from "@prisma/client";
import { updateSitePageMetadata } from "@/lib/actions";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { toast } from "sonner";

export default function SetHomePage({ sitePage }: { sitePage: SitePage }) {
    let [isPendingMakeHomePage, startTransitionMakeHomePage] = useTransition();
    const [data, setData] = useState<SitePage>(sitePage);

    return (
        <div>
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => {
                        const formData = new FormData();
                        console.log(data.isHomePage, typeof data.isHomePage);
                        formData.append("isHomePage", String(!data.isHomePage));
                        startTransitionMakeHomePage(async () => {
                            await updateSitePageMetadata(formData, sitePage.id, "isHomePage").then(() => {
                                toast.success(
                                    `Successfully ${
                                    data.isHomePage ? "Removed as Home Page" : "Made Home Page"
                                    } your page.`,
                                );
                                setData((prev) => ({ ...prev, isHomePage: !prev.isHomePage }));
                            });
                        });
                    }}
                    className={cn(
                        "flex px-4 py-1.5 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none",
                        isPendingMakeHomePage
                            ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                            : "border border-black bg-black text-white hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
                    )}
                    disabled={isPendingMakeHomePage}
                >
                    {isPendingMakeHomePage ? (
                        <LoadingDots />
                    ) : (
                        <p>{data.isHomePage ? "Remove as Home Page" : "Make Home Page"}</p>
                    )}
                </button>
            </div>
        </div>
    );
}
