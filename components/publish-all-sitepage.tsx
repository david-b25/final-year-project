"use client"

import { useTransition } from "react";
import { updateSite } from "@/lib/actions/site";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { Site } from "@prisma/client";
import { toast } from "sonner";

export default function PublishAllSitePage({ site }: { site: Site }){

    let [isPendingPublishing, startTransitionPublishing] = useTransition();

    return (
        <div>
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => {
                        const formData = new FormData();
                        console.log("Published All Pages");
                        startTransitionPublishing(async () => {
                            await updateSite(formData, site.id, "publishedAll").then(() => {
                                toast.success(
                                    `Successfully Published All Pages!`,
                                );
                            });
                        });
                    }}
                    className={cn(
                        "flex mr-2 px-4 py-1.5 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none",
                        isPendingPublishing
                            ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 "
                            : "border border-black bg-none text-black hover:bg-black hover:text-white active:bg-stone-100",
                    )}
                    disabled={isPendingPublishing}
                >
                    {isPendingPublishing ? (
                        <LoadingDots />
                    ) : (
                        <p>Publish All Pages</p>
                    )}
                </button>
            </div>
        </div>
    );
}
