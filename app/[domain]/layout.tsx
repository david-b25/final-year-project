import { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { getSiteData } from "@/lib/fetchers";
import { fontMapper } from "@/styles/fonts";
import { radiusMapper } from "@/styles/radius";
import { Metadata } from "next";

import { PageElementInstance } from "@/editor/page-elements";
import RenderPage from "@/editor/render-page";


export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);
  if (!data) {
    return null;
  }
  const {
    titleTag: title,
    metaDescription: description,
    openGraph: image,
    favicon: logo,
  } = data as {
    titleTag: string;
    metaDescription: string;
    openGraph: string;
    favicon: string;
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@siteup",
    },
    icons: [logo],
    metadataBase: new URL(`https://${domain}`),
    // Set canonical URL to custom domain if it exists
     ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
       data.customDomain && {
         alternates: {
           canonical: `https://${data.customDomain}`,
         },
       }),
  };
}

export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) {
    notFound();
  }

  const navbar = JSON.parse(data.savedNavbar) as PageElementInstance[];
  const footer = JSON.parse(data.savedFooter) as PageElementInstance[];

  if(!data.name) {
    notFound();
  }
  return (
    <div className={`${fontMapper[data.font]}`}>

        <RenderPage content={navbar} site={data} />

        {children}

        <RenderPage content={footer} site={data}/>

    </div>
  );
}