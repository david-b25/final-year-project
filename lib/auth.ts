import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";

export function withSiteAuth(action: any) {
    return async (
      formData: FormData | null,
      siteId: string,
      key: string | null,
    ) => {
      const { userId } = auth();
      if (!userId) {
        return {
          error: "Not authenticated",
        };
      }
      const site = await prisma.site.findUnique({
        where: {
          id: siteId,
        },
      });
      if (!site || site.userId !== userId) {
        return {
          error: "Not authorized",
        };
      }

      return action(formData, site, key);
  };
}

export function withSitePageAuth(action: any) {
  return async (
    formData: FormData | null,
    sitePageId: string,
    key: string | null,
  ) => {
    const { userId } = auth();
      if (!userId) {
        return {
          error: "Not authenticated",
      };
    }
    const sitePage = await prisma.sitePage.findUnique({
      where: {
        id: sitePageId,
      },
      include: {
        site: true,
      },
    });
    if (!sitePage || sitePage.userId !== userId) {
      return {
        error: "Post not found",
      };
    }

    return action(formData, sitePage, key);
  };
}

export function withContactFormAuth(action: any) {
  return async (
    formData: FormData | null,
    contactFormId: string,
    key: string | null,
  ) => {

    const contactForm = await prisma.contactForm.findUnique({
      where: {
        id: contactFormId,
      },
      include: {
        site: true,
      },
    });
    if (!contactForm) {
      return {
        error: "Contact form not found",
      };
    }

    return action(formData, contactForm, key);
  };
}
