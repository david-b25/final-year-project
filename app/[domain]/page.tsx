
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSiteData, getContactForm } from "@/lib/fetchers";
import TestingContactForm from "@/components/testing-contact-form";
import RenderPage from "@/editor/render-page";
import { PageElementInstance } from "@/editor/page-elements";
import { getHomePageData } from "@/lib/fetchers";

export async function generateStaticParams() {
    const allSites = await prisma.site.findMany({
      select: {
        subdomain: true,
        customDomain: true,
      },
    });
  
    const allPaths = allSites
      .flatMap(({ subdomain, customDomain }) => [
        subdomain && {
          domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
        },
        customDomain && {
          domain: customDomain,
        },
      ])
      .filter(Boolean);
  
    return allPaths;
}

export default async function SiteHomePage({
    params,
}: {
    params: { domain: string };
}) {
    const domain = decodeURIComponent(params.domain);
    const data = await getSiteData(domain);
    const home = await getHomePageData(domain);

    if (!data) {
      notFound();
    }

    if (!home) {
        notFound();
    }

    const homePage = JSON.parse(home.publishedContent) as PageElementInstance[];

    return (
      <RenderPage content={homePage} site={data}/>
  );
}