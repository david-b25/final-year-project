"use server"

import prisma from "@/lib/prisma";
import { Site, SitePage } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { withSiteAuth, withSitePageAuth } from "./auth";
import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { getBlurDataURL } from "@/lib/utils";

const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    7,
); // 7-character random string

export const updateSiteMetaData = withSiteAuth(
    async (formData: FormData, site: Site, key: string) => {
      const value = formData.get(key) as string;
  
      try {
        let response;
  
        if (key === "openGraph" || key === "favicon") {
          if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return {
              error:
                "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – please fill out this form for access: https://tally.so/r/nPDMNd",
            };
          }
  
          const file = formData.get(key) as File;
          const filename = `${nanoid()}.${file.type.split("/")[1]}`;
  
          const { url } = await put(filename, file, {
            access: "public",
          });
  
          const blurhash = key === "openGraph" ? await getBlurDataURL(url) : null;
  
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              [key]: url,
              ...(blurhash && { openGraphBlurhash: blurhash }),
            },
          });
        } else {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              [key]: value,
            },
          });
        }
        console.log(
          "Updated site data! Revalidating tags: ",
          `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
          `${site.customDomain}-metadata`,
        );
        await revalidateTag(
          `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        );
        site.customDomain &&
          (await revalidateTag(`${site.customDomain}-metadata`));
  
        return response;
      } catch (error: any) {
        if (error.code === "P2002") {
          return {
            error: `This ${key} is already taken`,
          };
        } else {
          return {
            error: error.message,
          };
        }
      }
    },
  );




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
        if (key === "openGraph") {
          const file = formData.get("openGraph") as File;
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
              openGraph: url,
              openGraphBlurhash: blurhash,
            },
          });
        } else {
          response = await prisma.sitePage.update({
            where: {
              id: sitePage.id,
            },
            data: {
                [key]: value,
            },
          });
        }
  
        await revalidateTag(
          `${sitePage.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
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