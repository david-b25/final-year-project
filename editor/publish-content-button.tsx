import React, { useTransition } from "react";
import { Button } from "@/editor/ui/button";
import { UpdateSitePagePublishedContent } from "@/lib/actions";
import { toast } from "sonner"; 
import { getSitePageSavedContent, getSitePagePublishedContent } from "@/lib/actions";
import { SitePage } from "@prisma/client";
import { notFound } from "next/navigation";

type SitePageWithSite = SitePage & { site: { subdomain: string | null } | null };

export default function PublishContentButton({ sitePage }: { sitePage: SitePageWithSite })  {
  const [loading, startTransition] = useTransition();
  
  const updateSitePagePublishedContent = async () => {
    const currentSavedContent = await getSitePageSavedContent({sitePageId: sitePage.id});
    const currentPublishedContent = await getSitePagePublishedContent({sitePageId: sitePage.id});

    try {
        if (!currentSavedContent || !currentPublishedContent) {
            return notFound();
        } else if (typeof currentSavedContent !== 'string' || typeof currentPublishedContent !== 'string') {
            toast.error(`Error: Invalid content!`);
            return;
        } else if (currentSavedContent === currentPublishedContent) {
            toast.info(`All Changes Already Published!`);
            return;
        }

        await UpdateSitePagePublishedContent(sitePage.id, sitePage, currentSavedContent);
        toast.success(`Successfuly Saved Changes!`);
    } catch (error) {
      toast.error(`Something went wrong! Please Check Your Connection and Try Again!`);
    }
  };
  
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="w-full rounded-lg bg-black px-4 py-1.5 text-sm text-white hover:bg-white hover:text-black"
      disabled={loading}
      onClick={() => {
        startTransition(updateSitePagePublishedContent);
      }}
    >
      {loading ? "Published..." : "Publish Changes"}
    </Button>
  );
}

