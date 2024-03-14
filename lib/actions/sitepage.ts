"use server"

import prisma from "@/lib/prisma";
import { Site, SitePage } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { withSiteAuth, withSitePageAuth } from "@/lib/auth";
import { auth } from "@clerk/nextjs";
import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { getBlurDataURL } from "@/lib/utils";


const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    7,
); // 7-character random string


//SitePage CRUD Operations
export const getSiteFromSitePageId = async (sitePageId: string) => {
    const sitePage = await prisma.sitePage.findUnique({
      where: {
        id: sitePageId,
      },
      select: {
        siteId: true,
      },
    });
    return sitePage?.siteId;
  };
  
  export const createSitePage = withSiteAuth(async (formData: FormData, site: Site) => {
  
    const { userId } = auth();
    if (!userId) {
      return {
        error: "Not Authenticated",
      };
    }
    let title = formData.get("title") as string;
    let slug = formData.get("slug") as string;
    const pageType = formData.get("pageType") as string;
    const description = formData.get("description") as string;
  
    // Check if any pages exist for the site
    const existingPages = await prisma.sitePage.findMany({
      where: {
        siteId: site.id,
      },
    });
  
    let isHomePage = false;
    if (existingPages.length === 0) {
      isHomePage = true;
      title = "Home";
      slug = "/";
    }
  
    let response;
    if(pageType === "None") {
       response = await prisma.sitePage.create({
        data: {
          siteId: site.id,
          userId: userId,
          title: title,
          slug: slug,
          description: description,
          isHomePage: isHomePage,
        },
      });
    } else {
       response = await prisma.sitePage.create({
        data: {
          siteId: site.id,
          userId: userId,
          title: title,
          slug: slug,
          pageTypeId: pageType, 
          description: description,
          isHomePage: isHomePage,
        },
      });
    }
  
    await revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-sitePages`,
    );
    site.customDomain && (await revalidateTag(`${site.customDomain}-sitePages`));
  
    return response;
  });



  export const createPageType = withSiteAuth(async (formData: FormData, site: Site) => {

    const { userId } = auth();
    if (!userId) {
      return {
        error: "Not Authenticated",
      };
    }
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
  
    const response = await prisma.pageType.create({
      data: {
        siteId: site.id,
        userId: userId,
        title: title,
        slug: slug,
      },
    });
  
    await revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-sitePages`,
    );
    site.customDomain && (await revalidateTag(`${site.customDomain}-sitePages`));
  
    return response;
  });
  
  
  
  export const updateSitePageMetadata = withSitePageAuth(
    async (
      formData: FormData,
      sitePage: SitePage & {
        site: Site;
      },
      key: string,
    ) => {
      const value = formData.get(key) as string;
  
      try {
        let response;
        if (key === "image") {
          const file = formData.get("image") as File;
          const filename = `${nanoid()}.${file.type.split("/")[1]}`;
  
          const { url } = await put(filename, file, {
            access: "public",
          });
  
          const blurhash = await getBlurDataURL(url);
  
          response = await prisma.sitePage.update({
            where: {
              id: sitePage.id,
            },
            data: {
              image: url,
              imageBlurhash: blurhash,
            },
          });
        } else if (key === "published" || key === "unpublished") {
          response = await prisma.sitePage.update({
            where: {
              id: sitePage.id,
            },
            data: {
              [key]: key === "published" ? value === "true" : value,
            },
          });
        } else {
          // Step 1: Find the current homepage
          const currentHomepage = await prisma.sitePage.findFirst({
            where: {
                isHomePage: true
            }
          });
  
          // Step 2: Set the current homepage's isHomePage to false if it exists and is not the same as the new homepage
          //const oldSlug = idGenerator();
          if (currentHomepage && currentHomepage.id !== sitePage.id) {
            await prisma.sitePage.update({
                where: {
                    id: currentHomepage.id
                },
                data: {
                    isHomePage: false,
                    slug: "old-home",
                    title: "Old Home",
                }
            });
          }
          
          // Step 3: Set the new homepage 
          response = await prisma.sitePage.update({
            where: {
              id: sitePage.id,
            },
            data: {
              [key]: key === "isHomePage" ? value === "true" : value,
              slug: "/",
              title: "Home",
            },
          });
  
          await revalidateTag(
            `${sitePage.site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
          );
          sitePage.site.customDomain &&
            (await revalidateTag(`${sitePage.site.customDomain}-metadata`));
        }
  
        await revalidateTag(
          `${sitePage.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-sitePages`,
        );
        await revalidateTag(
          `${sitePage.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${sitePage.slug}`,
        );
  
        // if the site has a custom domain, we need to revalidate those tags too
        sitePage.site?.customDomain &&
          (await revalidateTag(`${sitePage.site?.customDomain}-sitePages`),
          await revalidateTag(`${sitePage.site?.customDomain}-${sitePage.slug}`));
  
        return response;
      } catch (error: any) {
        if (error.code === "P2002") {
          return {
            error: `This slug is already in use`,
          };
        } else {
          return {
            error: error.message,
          };
        }
      }
    },
  );
  
  
  export const deleteSitePage = withSitePageAuth(async (_: FormData, sitePage: SitePage) => {
    try {
      const response = await prisma.sitePage.delete({
        where: {
          id: sitePage.id,
        },
        select: {
          siteId: true,
        },
      });
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  });

  export async function UpdateSitePageSavedContent(id: string, sitePage: SitePage, jsonContent: string) {
    const { userId } = auth();
    if (!userId) {
      return {
        error: "Not authenticated",
      };
    }
    
    const response = await prisma.sitePage.update({
      where: {
        id: id,
      },
      data: {
        savedContent: jsonContent,
      },
      include: {
        site: true,
      },
    });
  
  
    await revalidateTag(
      `${response.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-sitePages`,
    );
    await revalidateTag(
      `${response.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${sitePage.slug}`,
    );
  
    // if the site has a custom domain, we need to revalidate those tags too
    response.site?.customDomain &&
      (await revalidateTag(`${response.site?.customDomain}-sitePages`),
      await revalidateTag(`${response.site?.customDomain}-${sitePage.slug}`));
  
    return response;
  }
  
  export async function UpdateSitePagePublishedContent(id: string, sitePage: SitePage, currentSavedContent: string) {
    const { userId } = auth();
    if (!userId) {
      return {
        error: "Not authenticated",
      };
    }
    
    const response = await prisma.sitePage.update({
      where: {
        id: id,
      },
      data: {
        publishedContent: currentSavedContent,
      },
      include: {
        site: true,
      },
    });
  
  
    await revalidateTag(
      `${response.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-sitePages`,
    );
    await revalidateTag(
      `${response.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${sitePage.slug}`,
    );
  
    // if the site has a custom domain, we need to revalidate those tags too
    response.site?.customDomain &&
      (await revalidateTag(`${response.site?.customDomain}-sitePages`),
      await revalidateTag(`${response.site?.customDomain}-${sitePage.slug}`));
  
    return response;
  }
  
  
  export async function getSitePageSavedContent({sitePageId} : {sitePageId: string}) {
    const { userId } = auth();
    if (!userId) {
      return {
        error: "Not authenticated",
      };
    }
  
    const data = await prisma.sitePage.findUnique({
      where: { id: sitePageId },
    });
  
    if (!data || data.userId !== userId) {
      return null;
    }
  
    return data.savedContent;
  }
  
  export async function getSitePagePublishedContent({sitePageId} : {sitePageId: string}) {
    const { userId } = auth();
    if (!userId) {
      return {
        error: "Not authenticated",
      };
    }
  
    const data = await prisma.sitePage.findUnique({
      where: { id: sitePageId },
    });
  
    if (!data || data.userId !== userId) {
      return null;
    }
  
    return data.publishedContent;
  }



