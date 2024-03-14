"use client";

import { toast } from "sonner";
import { createSitePage } from "@/lib/actions/sitepage";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "@/components/modal/provider";
import va from "@vercel/analytics";
import { useEffect, useState } from "react";

export default function CreateSitePageModal({ id }: { id: string}) {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    title: "",
    slug: "",
    pageType: "",
    description: "",
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      slug: prev.title
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, "-"),
    }));
  }, [data.title]);

  return (
    <form
      action={async (data: FormData) =>
        createSitePage(data, id, "create").then((res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Created Page");
            const { id } = res;
            router.push(`/app/sitepage/${id}`);
            modal?.hide();
            toast.success(`Successfully created page!`);
          }
        })
      }
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl dark:text-white">Create a new page</h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Page Name
          </label>
          <input
            name="title"
            type="text"
            placeholder="My New Page"
            autoFocus
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="slug"
            className="text-sm font-medium text-stone-500"
          >
            Slug
          </label>
          <div className="flex w-full max-w-md">
            <div className="flex items-center rounded-l-lg border border-r-0 border-stone-200 bg-stone-100 px-3 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
              {process.env.NEXT_PUBLIC_ROOT_DOMAIN}/
            </div>
            <input
              name="slug"
              type="text"
              placeholder="page-name"
              value={data.slug}
              onChange={(e) => setData({ ...data, slug: e.target.value })}
              autoCapitalize="off"
              pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
              maxLength={32}
              required
              className="w-full rounded-r-lg border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="subdomain"
            className="text-sm font-medium text-stone-500"
          >
            Page Type
          </label>
            <select
              name="pageType"
              value={data.pageType}
              onChange={(e) => setData({ ...data, pageType: e.target.value })}
              className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black  focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
            >
              <optgroup label="Main Pages">
                <option className="bg-black" value="GENERAL">Home</option>
                <option value="GENERAL">About</option>
                <option value="GENERAL">Careers</option>
                <option value="GENERAL">Contact</option>
                <option value="GENERAL">Other</option>
              </optgroup>
              <optgroup label="Content Pages">
                <option value="SERVICE">Service</option>
                <option value="PRODUCT">Product</option>
                <option value="POST">Blog Post</option>
                <option value="NEWS">News Article</option>
              </optgroup>
            </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-stone-500"
          >
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description about this page"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            maxLength={140}
            rows={3}
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black  focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <CreateSitePageFormButton />
      </div>
    </form>
  );
}
function CreateSitePageFormButton() {
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