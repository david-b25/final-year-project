import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import SitePageCard from "@/components/sitepage-card";
import Image from "next/image";
import { Site, SitePage } from "@prisma/client";

export default async function RenderSitePages({
  site,
  sitePages,
}: {
  site: Site;
  sitePages: SitePage[];
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }


  return sitePages.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {sitePages.map((sitePage) => (
        <SitePageCard key={sitePage.id} data={sitePage} site={site} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="mt-10 font-cal text-4xl mb-10">No Pages Yet</h1>
      <Image
        alt="missing post"
        src="/no-pages.jpg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any pages yet. Create one to get started.
      </p>
    </div>
  );
}