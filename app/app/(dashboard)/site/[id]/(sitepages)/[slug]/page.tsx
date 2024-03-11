import { auth } from "@clerk/nextjs"
import { redirect, notFound } from "next/navigation";
import { Site, SitePage, PageType } from "@prisma/client";
import prisma from "@/lib/prisma";
import RenderSitePages from "@/components/sitepages";

export default async function PagesByType({
    params,
  }: {
    params: { id: string;  slug: string };
  }) {
    const slug = decodeURIComponent(params.slug);

    const { userId } = auth();

    if (!userId) {
      redirect("/sign-in");
    }

    const data = await prisma.site.findUnique({
        where: {
          id: decodeURIComponent(params.id),
        },
    });
    
    if (!data || data.userId !== userId) {
        notFound();
    }

    const sitePages = await prisma.sitePage.findMany({
        where: {
          siteId: decodeURIComponent(params.id),
          pageType: {
            slug: slug
          }
        },
        include: {
          site: true
        }
    });

    if (!sitePages) {
        notFound();
    }

    return (<RenderSitePages site={data} sitePages={sitePages}/>);
}