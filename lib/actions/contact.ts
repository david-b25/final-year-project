"use server"

import prisma from "@/lib/prisma";
import { Site, ContactForm } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { withSiteAuth, withContactFormAuth } from "@/lib/auth";
import { auth } from "@clerk/nextjs";

import { Resend } from 'resend';
import { GithubAccessTokenEmail } from '@/components/email-template';



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

  

