"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createFormSubmission } from "@/lib/actions";
import va from "@vercel/analytics";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { ContactForm } from "@prisma/client";

export default function TestingContactForm({contactForm}: {contactForm: ContactForm}) {
  const router = useRouter();

  const [data, setData] = useState({
    submissionEmail: "",
    submissionName: "",
    submissionMessage: "",
  });

  return (
    <form
        action={async (data: FormData) =>
        createFormSubmission(data, contactForm.id, "create").then((res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Created Page");
            const { id } = res;
            router.refresh();
            toast.success(`Successfully Submitted Enquiry!`);
          }
        })
      }
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl dark:text-white">Contact Our Team</h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="submissionEmail"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Email
          </label>
          <input
            name="submissionEmail"
            type="email"
            placeholder="My Awesome Site"
            autoFocus
            value={data.submissionEmail}
            onChange={(e) => setData({ ...data, submissionEmail: e.target.value })}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="submissionName"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            submissionName
          </label>
          <input
            name="submissionName"
            type="text"
            placeholder="My Awesome Site"
            value={data.submissionName}
            onChange={(e) => setData({ ...data, submissionName: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="submissionMessage"
            className="text-sm font-medium text-stone-500"
          >
            submissionMessage
          </label>
          <textarea
            name="submissionMessage"
            placeholder="Description about why my site is so awesome"
            value={data.submissionMessage}
            onChange={(e) => setData({ ...data, submissionMessage: e.target.value })}
            maxLength={140}
            rows={3}
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black  focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <CreateSiteFormButton />
      </div>
    </form>
  );
}

function CreateSiteFormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Create Site</p>}
    </button>
  );
}