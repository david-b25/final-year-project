"use server"

import prisma from "@/lib/prisma";
import { Site } from "@prisma/client";
import { withSiteAuth } from "@/lib/auth";
import { auth } from "@clerk/nextjs";

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
  
