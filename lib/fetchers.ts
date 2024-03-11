import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { Site, SitePage, PageType } from "@prisma/client";

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      return prisma.site.findUnique({
        where: subdomain ? { subdomain } : { customDomain: domain },
      });
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
  )();
}

export async function getHomePageData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      const data = await prisma.sitePage.findFirst({
        where: {
          site: subdomain ? { subdomain } : { customDomain: domain },
          published: true,
          isHomePage: true,
        },
        include: {
          site: true,
        },
      });

      //console.log("Home Page");
      if (!data) return null;

      return {
        ...data,
      };
    },
    [`${domain}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${domain}`],
    },
  )();
}

export async function getSitePageData(domain: string, slug: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      const data = await prisma.sitePage.findFirst({
        where: {
          site: subdomain ? { subdomain } : { customDomain: domain },
          slug,
          published: true,
          isHomePage: false,
        },
        include: {
          site: true,
        },
      });

      if (!data) return null;

      return {
        ...data,
      };
    },
    [`${domain}-${slug}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${domain}-${slug}`],
    },
  )();
}


export async function getCollectionData(site: Site, title: string){

      const response = prisma.sitePage.findMany({
        where: {
          siteId: site.id,
          pageType: {
            title: title
          }
        },
      }); 

      return response;
}





export async function getContactForm(site: Site){

  const response = await prisma.contactForm.findUnique({
    where: {
      siteId: site.id
    }
  })

  return response;
}

export async function getSitePagesForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      return prisma.sitePage.findMany({
        where: {
          site: subdomain ? { subdomain } : { customDomain: domain },
          published: true,
        },
        select: {
          title: true,
          description: true,
          slug: true,
          image: true,
          imageBlurhash: true,
          createdAt: true,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    },
    [`${domain}-sitePages`],
    {
      revalidate: 900,
      tags: [`${domain}-sitePages`],
    },
  )();
}