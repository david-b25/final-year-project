import { auth } from "@clerk/nextjs"
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import WebsiteEditor from "@/editor/website-editor";

export default async function Editor({ params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const data = await prisma.sitePage.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
    include: {
      site: {
        select: {
          subdomain: true,
        },
      },
    },
  });

  if (!data || !data.siteId || !data.site || data.userId !== userId) {
    notFound();
  }

  const site = await prisma.site.findUnique({
    where: {
      id: data.siteId,
    },
  });

  if (!site) {
    notFound();
  }

  const url = `${data.site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  const sitePages = await prisma.sitePage.findMany({
    where: {
      siteId: data.siteId,
    },
  });

  return (<WebsiteEditor site={site} sitePage={data} sitePages={sitePages} url={url} />)
}




  

  