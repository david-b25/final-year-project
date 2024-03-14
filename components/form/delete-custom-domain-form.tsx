"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { deleteCustomDomain } from "@/lib/actions/domains";
import va from "@vercel/analytics";
import { useState } from "react";
import CustomDomainStatus from "./custom-domain-status";

export default function DeleteCustomDomainForm({ siteName, domain, domain_uuid }: { siteName: string, domain: string, domain_uuid: string }) {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  if(!domain || !domain_uuid){
    console.log("No domain or domain_uuid provided");
    return null;
  } 

  return (
    <form
      action={async (data: FormData) =>
        window.confirm("Are you sure you want to remove your custom domain?") &&
        deleteCustomDomain(data, id, "delete")
          .then(async (res) => {
            if (res.error) {
              toast.error(res.error);
            } else {
              va.track("Deleted custom domain");
              router.refresh();
              router.refresh();
              toast.success(`Successfully deleted custom domain!`);
            }
          })
          .catch((err: Error) => toast.error(err.message))
      }
      className="rounded-lg border border-red-600 bg-white dark:bg-black"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="font-cal text-xl dark:text-white">Remove Custom Domain</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          This action deletes your custom domain and removes it from the internet. If you wish to continue, type in the name
          of your custom domain <b>{domain}</b> to confirm.
        </p>
        <div className="flex items-center">
          <input
            name="confirm"
            type="text"
            required
            pattern={domain}
            placeholder={domain}
            className="w-full max-w-md rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
          />
          <CustomDomainStatus domain_uuid={domain_uuid} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-center text-sm text-stone-500 dark:text-stone-400">
          This action is will remove your custom domain. Please proceed with caution.
        </p>
        <div className="w-32">
          <FormButton />
        </div>
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-8 w-32 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-red-600 bg-red-600 text-white hover:bg-white hover:text-red-600 dark:hover:bg-transparent",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Confirm Delete</p>}
    </button>
  );
}
