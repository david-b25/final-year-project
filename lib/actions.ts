"use server"

import prisma from "@/lib/prisma";
import { Site, SitePage, ContactForm, FormSubmission, PageType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { withSiteAuth, withSitePageAuth, withContactFormAuth } from "./auth";
import { auth } from "@clerk/nextjs";
import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { getBlurDataURL } from "@/lib/utils";

import { idGenerator } from "@/lib/utils";

import { Resend } from 'resend';
import { GithubAccessTokenEmail } from '@/components/email-template';

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




//Adding custom domain to SaasCustomDomains
export async function createCustomDomain(customDomain: string) {
  const response = await fetch(`${process.env.DOMAIN_BASEURL}/accounts/${process.env.ACCOUNT_UUID}/upstreams/${process.env.UPSTREAM_UUID}/custom_domains`, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${process.env.DOMAIN_TOKEN}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ host: customDomain }),
  });
  const result = await response.json();
  
  return result;
}


//Custom domain information from SaasCustomDomains - Single Domain
export async function statusCustomDomain(domain_uuid: string) {
  const response = await fetch(`${process.env.DOMAIN_BASEURL}/accounts/${process.env.ACCOUNT_UUID}/upstreams/${process.env.UPSTREAM_UUID}/custom_domains/${domain_uuid}`, {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${process.env.DOMAIN_TOKEN}`,
    },
  });
  const result = await response.json();
  return result;
}


//Force recheck DNS status from SaasCustomDomains
export async function verifyStatusCustomDomain(domain_uuid: string) {
  const response = await fetch(`${process.env.DOMAIN_BASEURL}/accounts/${process.env.ACCOUNT_UUID}/upstreams/${process.env.UPSTREAM_UUID}/custom_domains/${domain_uuid}/verify_dns_records`, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${process.env.DOMAIN_TOKEN}`,
    },
  });
  console.log(response);
  const result = await response.json();
  return result;
}



//Testing Delete Custom Domain 
export const deleteCustomDomain = withSiteAuth(
  async (formData: FormData, site: Site, key: string) => {
    const { userId } = auth();
    if (!userId) {
      return {
        error: "Not Authenticated",
      };
    }
    
    const domain_uuid = site.domain_uuid;

    const response = await fetch(`${process.env.DOMAIN_BASEURL}/accounts/${process.env.ACCOUNT_UUID}/upstreams/${process.env.UPSTREAM_UUID}/custom_domains/${domain_uuid}`, {
      method: 'DELETE',
      headers: {
          Authorization: `Bearer ${process.env.DOMAIN_TOKEN}`,
      },
    });
    const result = await response.json();

    await prisma.site.update({
      where: {
        id: site.id,
      },
      data: {
        customDomain: null,
        domain_uuid: null,
      }
    });
  
    return result;
  } 
);



//Contact Form Crud
export const createContactForm = withSiteAuth(async (formData: FormData, site: Site) => {

  const { userId } = auth();
  if (!userId) {
    return {
      error: "Not Authenticated",
    };
  }
  const title = formData.get("title") as string;
  const email = formData.get("email") as string;

  const response = await prisma.contactForm.create({
    data: {
      siteId: site.id,
      userId: userId,
      title: title,
      email: email,
    },
  });

  await revalidateTag(
    `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-sitePages`,
  );
  site.customDomain && (await revalidateTag(`${site.customDomain}-sitePages`));

  return response;
});

//Contact Form Crud
export const createFormSubmission = withContactFormAuth(
  async (
    formData: FormData,
    contactForm: ContactForm & {
      site: Site;
    },
  ) => {

  const submissionEmail = formData.get("submissionEmail") as string;
  const submissionName = formData.get("submissionName") as string;
  const submissionMessage = formData.get("submissionMessage") as string;

  const response = await prisma.formSubmission.create({
    data: {
      siteId: contactForm.site.id,
      contactFormId: contactForm.id,
      submissionEmail: submissionEmail,
      submissionName: submissionName,
      submissionMessage: submissionMessage,
    },
  });

  await revalidateTag(
    `${contactForm.site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-sitePages`,
  );
  contactForm.site.customDomain && (await revalidateTag(`${contactForm.site.customDomain}-sitePages`));

  const email = contactForm.email;

  if (!email) {
    return {
      error: "No email address found for this form",
    };
  }

  await sendEmail({ email });
  return response;
});

async function sendEmail({email}: {email: string}){
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  const { data } = await resend.emails.send({
    from: 'form-submission@davidbohan.com',
    to: email,
    subject: 'New Website Form Submission',
    react: GithubAccessTokenEmail({ username: 'david'}),
  });

}



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

    