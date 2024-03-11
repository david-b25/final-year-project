import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSitePageData, getSiteData } from "@/lib/fetchers";

import { PageElementInstance } from "@/editor/page-elements";
import RenderPage from "@/editor/render-page";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);

  const [data, siteData] = await Promise.all([
    getSitePageData(domain, slug),
    getSiteData(domain),
  ]);
  if (!data || !siteData) {
    return notFound();
  }
  const { title, description } = data;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@vercel",
    },
    // Set canonical URL to custom domain if it exists
     ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
       siteData.customDomain && {
         alternates: {
           canonical: `https://${siteData.customDomain}/${params.slug}`,
         },
       }),
  };
}

export async function generateStaticParams() {
  const allSitePages = await prisma.sitePage.findMany({
    select: {
      slug: true,
      site: {
        select: {
          subdomain: true,
          customDomain: true,
        },
      },
    },
    
  });

  const allPaths = allSitePages
    .flatMap(({ site, slug }) => [
      site?.subdomain && {
        domain: `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
        slug,
      },
      site?.customDomain && {
        domain: site.customDomain,
        slug,
      },
    ])
    .filter(Boolean);

  return allPaths;
}

export default async function SiteMainPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);
  const siteData = await getSiteData(domain);

  const pageData = await getSitePageData(domain, slug);

  if (!siteData) {
    notFound();
  }

  if (!pageData) {
    notFound();
  }

  const pageContent = JSON.parse(pageData.publishedContent) as PageElementInstance[];

  return (
    <RenderPage content={pageContent} site={siteData}/>
  ); 
};