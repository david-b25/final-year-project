"use server"

import prisma from "@/lib/prisma";
import { Site, SitePage } from "@prisma/client";
import { revalidateTag } from "next/cache";
import {  withSitePageAuth, withContactFormAuth } from "@/lib/auth";
import { auth } from "@clerk/nextjs";
import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { getBlurDataURL } from "@/lib/utils";

const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    7,
); // 7-character random string

//asset crud
export const createAsset = withSitePageAuth(
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
        
        if (value === "image") {
          if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return {
              error:
                "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – please fill out this form for access: https://tally.so/r/nPDMNd",
            };
          }
  
          const file = formData.get(value) as File;
          const filename = `${nanoid()}.${file.type.split("/")[1]}`;
  
          const { url } = await put(filename, file, {
            access: "public",
          });
  
          const blurhash = value === "image" ? await getBlurDataURL(url) : null;
  
          const { userId } = auth();
          if (!userId) {
            return {
              error: "Not authenticated",
            };
          }
          
          response = await prisma.asset.create({
            data: {
              siteId: sitePage.site.id,
              userId: userId,
              [key]: url,
              ...(blurhash && { imageBlurhash: blurhash }),
            },
          });
        } 
  
        console.log(
          "Updated site data! Revalidating tags: ",
          `${sitePage.site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
          `${sitePage.site.customDomain}-metadata`,
        );
        await revalidateTag(
          `${sitePage.site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        );
        sitePage.site.customDomain &&
          (await revalidateTag(`${sitePage.site.customDomain}-metadata`));
  
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



  export const createAssetModel = async (url: string, id: string) => {
    try { 
      const { userId } = auth();
      if (!userId) {
        return {
          error: "Not authenticated",
        };
      }
  
      const sitePage = await prisma.sitePage.findUnique({
        where: {
          id: id,
        },
        include: {
          site: true,
        },
      });
  
      if (!sitePage || !sitePage.site || sitePage.userId !== userId) {
        return {
          error: "Not found",
        };
      }
  
      const response = await prisma.asset.create({
        data: {
          siteId: sitePage.site.id,
          userId: userId,
          image: url,
        },
      });
  
      await revalidateTag(
        `${sitePage.site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      if (sitePage.site.customDomain) {
        await revalidateTag(`${sitePage.site.customDomain}-metadata`);
      }
  
      return response;
  
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This key is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  };
  