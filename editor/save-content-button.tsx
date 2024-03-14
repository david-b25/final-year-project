import React, { useTransition } from "react";
import { Button } from "@/editor/ui/button";
import { UploadCloud } from "lucide-react";
import { UpdateSiteSavedNavbar, UpdateSiteSavedFooter } from "@/lib/actions/site";
import { toast } from "sonner"; 
import { useEffect } from "react";
import { UpdateSitePageSavedContent, getSitePageSavedContent } from "@/lib/actions/sitepage";
import { Site, SitePage } from "@prisma/client";
import useDesigner from "@/editor/hooks/use-designer";

type SitePageWithSite = SitePage & { site: { subdomain: string | null } | null };

export default function SaveContentButton({ site, sitePage }: { site: Site, sitePage: SitePageWithSite })  {
  const { elements, selectedElement } = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateSitePageSavedContent = async () => {
    const currentSavedContent = await getSitePageSavedContent({sitePageId: sitePage.id});
  
    try {
      const navbarElements = elements.filter(element => element.type.startsWith('Navbar'));
      const footerElements = elements.filter(element => element.type.startsWith('Footer'));
      const pageElements = elements.filter(element => !element.type.startsWith('Navbar') && !element.type.startsWith('Footer'));
  
      const jsonNavbar = JSON.stringify(navbarElements);
      const jsonFooter = JSON.stringify(footerElements);
      const jsonPageElements = JSON.stringify(pageElements);
  
      //if (currentSavedContent === jsonPageElements) {
      //  toast.info(`All Changes Already Saved!`);
      //  return;
      //}
  
      await UpdateSiteSavedNavbar(site.id, site, jsonNavbar);
      await UpdateSiteSavedFooter(site.id, site, jsonFooter);
      await UpdateSitePageSavedContent(sitePage.id, sitePage, jsonPageElements);
  
      toast.success(`Successfully Saved Changes!`);
    } catch (error) {
      toast.error(`Something went wrong! Please Check Your Connection and Try Again!`);
    }
  };

  // listen to CMD + S and override the default behavior
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "s") {
        e.preventDefault();
        startTransition(async () => {
          await updateSitePageSavedContent();
        });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [startTransition, updateSitePageSavedContent]);
  
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="rounded-lg bg-black px-2 py-1 text-sm text-white hover:bg-white hover:text-black"
      disabled={loading}
      onClick={() => {
        startTransition(updateSitePageSavedContent);
      }}
    >
      {loading ? "Saving..." : "Save"}
      <UploadCloud className="h-3" />
    </Button>
  );
}

