import { ReactNode } from "react";
import { auth } from "@clerk/nextjs"
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import SitePagesNav from "./nav";

import CreateSitePage from "@/components/create-sitepage";
import PublishAllSitePage from "@/components/publish-all-sitepage";


export default async function SitePages({
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const pageTypes = await prisma.pageType.findMany({
    where: {
      siteId: decodeURIComponent(params.id),
    },
  })

  const data = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
    include: {
      sitepages: true, // Include sitePages in the query
    },
  });

  if (!data || data.userId !== userId) {
    notFound();
  }

  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
    <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
      <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
        <h1 className="w-60 truncate font-cal text-xl text-center  font-bold dark:text-white sm:w-auto sm:text-3xl">
          All Site Pages
        </h1>
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.subdomain}.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
        >
          {url} ↗
        </a>
      </div>
      <div className="hidden md:flex items-center justify-end">
          {data.sitepages && data.sitepages.length > 0 && <PublishAllSitePage site={data}/>}
          <CreateSitePage pageTypes={pageTypes}/>
      </div>
      </div>
      <SitePagesNav pageTypes={pageTypes}/>
      {children}
    </>
  );
}