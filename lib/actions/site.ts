"use server"

import prisma from "@/lib/prisma";
import { Site } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { withSiteAuth } from "@/lib/auth";
import { auth } from "@clerk/nextjs";
import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { getBlurDataURL } from "@/lib/utils";
import { createCustomDomain } from "@/lib/actions/domains";

import { validDomainRegex } from "@/lib/domains";

const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    7,
); // 7-character random string


export const createSite = async (formData: FormData) => {
    const { userId } = auth();

    if(!userId){
        return new Response("Unauthorized", { status: 401 });
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const subdomain = formData.get("subdomain") as string;
    
    try {
        const response = await prisma.site.create({
            data: {
                userId,
                name,
                description,
                subdomain,
          },
        });
        await revalidateTag(
          `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        );
        return response;
      } catch (error: any) {
        if (error.code === "P2002") {
          return {
            error: `This subdomain is already taken`,
          };
        } else {
          return {
            error: error.message,
        };
        }
    }
};


export const updateSite = withSiteAuth(
    async (formData: FormData, site: Site, key: string) => {
      const value = formData.get(key) as string;
  
      try {
        let response;
  
        if (key === "customDomain") {
          if (value.includes("siteup.ai")) {
            return {
              error: "Cannot use siteup.ai as your custom domain",
          }
  
          } else if (validDomainRegex.test(value)) {
            response = await prisma.site.update({
              where: {
                id: site.id,
              },
              data: {
                customDomain: value,
              },
            });
            
            const domain_uuid = await createCustomDomain(value);
  
            response = await prisma.site.update({
              where: {
                id: site.id,
                customDomain: value,
              },
              data: {
                domain_uuid: domain_uuid.uuid,
              },
            });
          }
  
        } else if (key === "image" || key === "logo") {
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
  
          const blurhash = key === "image" ? await getBlurDataURL(url) : null;
  
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              [key]: url,
              ...(blurhash && { imageBlurhash: blurhash }),
            },
          });
        } else if (key === "publishedAll") {
          response = await prisma.sitePage.updateMany({
              where: {
                siteId: site.id, 
              },
              data: {
                  published: true,
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
  
  export const deleteSite = withSiteAuth(async (_: FormData, site: Site) => {
    try {
      const response = await prisma.site.delete({
        where: {
          id: site.id,
        },
      });
      await revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      response.customDomain &&
        (await revalidateTag(`${site.customDomain}-metadata`));
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  });
  

//Update Navbar Value
export async function UpdateSiteSavedNavbar(id: string, site: Site, jsonContent: string) {
    const { userId } = auth();
    if (!userId) {
      return {
        error: "Not authenticated",
      };
    }
    
    const response = await prisma.site.update({
      where: {
        id: id,
      },
      data: {
        savedNavbar: jsonContent,
      },
    });
  
  
    await revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    site.customDomain &&
      (await revalidateTag(`${site.customDomain}-metadata`));
  
    return response;
  }
  
  //Update Footer Value
  export async function UpdateSiteSavedFooter(id: string, site: Site, jsonContent: string) {
    const { userId } = auth();
    if (!userId) {
      return {
        error: "Not authenticated",
      };
    }
    
    const response = await prisma.site.update({
      where: {
        id: id,
      },
      data: {
        savedFooter: jsonContent,
      },
    });
  
  
    await revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    site.customDomain &&
      (await revalidateTag(`${site.customDomain}-metadata`));
  
    return response;
  }
  