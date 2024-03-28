"use server"

import prisma from "@/lib/prisma";
import { Site, PageType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { withSiteAuth } from "@/lib/auth";
import { auth } from "@clerk/nextjs";
import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { getBlurDataURL } from "@/lib/utils";
import { createCustomDomain } from "@/lib/actions/domains";
import { validDomainRegex } from "@/lib/utils";

import { generate } from "@/lib/actions/generate/generate";

import { generateHomePage } from "@/lib/actions/generate/home";
import { generateAboutPage } from "@/lib/actions/generate/about";
import { generateContactPage } from "@/lib/actions/generate/contact";
import { generateServicesPage } from "@/lib/actions/generate/services";
import { generateService } from "@/lib/actions/generate/service";

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
    const subdomain = formData.get("subdomain") as string;
    const description = formData.get("description") as string;
    const about = formData.get("about") as string;
    const services: string[] = [];
    formData.forEach((value, key) => {
        if (typeof value === 'string' && key.startsWith('services.') && key.endsWith('.name')) {
            if (value.trim() !== '') {
                services.push(value);
            }
        }
    });

    console.log(formData);
    const savedNavbar = JSON.stringify([{"id":"1772","type":"NavbarOne","extraAttributes":{"backgroundColour":"#0D333D","button":{"text":"Contact Our Team","textColour":"#0d343d","link":"contact","backgroundColour":"#FFE59B"},"linksColour":"#FFFFFF","linksMobileColour":"#0d343d","links":[{"title":"Home","link":"/","key":"7748"},{"title":"Services","link":"services","key":"1725"},{"title":"About Us","link":"about","key":"2979"}]}}])
    const savedFooter = JSON.stringify([{"id":"6360","type":"FooterOne","extraAttributes":{"backgroundColour":"#0d343d","description":{"text":"Ciaran Bohan is a Civil Engineer and Project Manager with over 17 years’ experience in the Building and Civil Engineering industry.","textColour":"#FFFFFF"},"linksTitles":{"textOne":"Explore","textColourOne":"#FFFFFF","textTwo":"Contact Us","textColourTwo":"#FFFFFF"},"linksColour":"#FFFFFF","linksOne":[{"title":"Home","link":"/","key":"8928"},{"title":"About Us","link":"about","key":"8198"},{"title":"Services","link":"services","key":"8414"},{"title":"Contact Us","link":"contact","key":"890"}],"linksTwo":[{"title":"ciaranb17@yahoo.com","link":"ciaranb17@yahoo.com","key":"1475"},{"title":"0873883357","link":"0873883357","key":"6343"},{"title":"Galway, Ireland","link":"/","key":"6322"}],"copyright":{"text":"© Copyright 2024. All Rights Reserved.","textColour":"#FFFFFF"},"linksThree":[{"title":"Privacy Policy","link":"/","key":"2655"},{"title":"Terms & Conditions","link":"/","key":"7461"},{"title":"Cookie Policy","link":"/","key":"5793"}]}}])

    try {
        const site = await prisma.site.create({
            data: {
                userId,
                name,
                description,
                subdomain,
                savedNavbar: savedNavbar,
                savedFooter: savedFooter,
          },
        });
        await revalidateTag(
          `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        );

        await generate(about);

        await generateSitePages(site, description, about, services);

        return site;
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



export const generateSitePages = async (site: Site, description: string, about: string, services: string[]) => {
    
    console.log(`generateSitePages ran for site ID: ${site.id}, About: ${about}, Services: ${services.join(", ")}`);


    const homeContent = await generateHomePage(description, about);
    const serviceContent = await generateServicesPage(description, about);
    const aboutContent = await generateAboutPage(description, about);
    const contactContent = await generateContactPage(description, about);

    await createSitePage(site, "Home", "home", "None", homeContent, description, about);
    await createSitePage(site, "Services", "services", "None", serviceContent, description, about);
    await createSitePage(site, "About", "about", "None", aboutContent, description, about);
    await createSitePage(site, "Contact", "contact", "None", contactContent, description, about);


    let pageType;
    try {
        pageType = await createPageType(site, "Services", "Services");
        console.log(pageType);
    } catch (error) {
        console.error("Error creating page type:", error);
        pageType = { error: "Failed to create page type." }; 
    }

    if(!pageType){
        pageType = await createPageType(site, "Services", "Services");
        console.log(pageType);
    }

    if (!pageType || 'error' in pageType) {
        console.log("Error or pageType is not defined, skipping site pages creation.");
    } else {
        for (const serviceName of services) {
            const slug = serviceName.toLowerCase().replace(/\s+/g, '-');
            try {
                const serviceContent = await generateService(description, about);
                await createSitePage(site, serviceName, slug, pageType.id, serviceContent,  description, about);
            } catch (error) {
                console.error(`Error creating site page for ${serviceName}:`, error);
            }
        }
    }

    const response = "Generation Ran created"; 
    return response;
};

export const createPageType = async (site: Site, title: string, slug: string) => {

    const { userId } = auth();
    if (!userId) {
      return {
        error: "Not Authenticated",
      };
    }

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
};


export const createSitePage = async (
    site: Site,
    title: string,
    slug: string,
    pageType: string,
    jsonContent: string,
    description: string,
    about: string
  ) => {


    const { userId } = auth();
    if (!userId) {
      return {
        error: "Not Authenticated",
      };
    }
    
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
            savedContent: jsonContent,
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
};




export const updateSite = withSiteAuth(
    async (formData: FormData, site: Site, key: string) => {
      const value = formData.get(key) as string;
  
      try {
        let response;
  
        if (key === "customDomain") {
          if (value.includes("davidbohan.com")) {
            return {
              error: "Cannot use davidbohan.com as your custom domain",
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
  


