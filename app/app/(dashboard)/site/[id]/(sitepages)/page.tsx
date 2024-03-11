import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import RenderSitePages from "@/components/sitepages";
import { PageType } from "@prisma/client";

export default async function SiteOverview({
  params,
}: {
  params: { id: string };
}) {
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
      siteId: data.id,
      userId: userId,
      pageType: null,
    },
    include: {
      site: true
    }
  });

  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (<RenderSitePages site={data} sitePages={sitePages}/>);
}