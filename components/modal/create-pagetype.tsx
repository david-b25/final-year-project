"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import va from "@vercel/analytics";
import { useEffect, useState } from "react";
import { createPageType } from "@/lib/actions/sitepage";

export default function CreateSitePageModal() {
  const router = useRouter();
  const modal = useModal();
  const { id } = useParams() as { id: string };

  const [data, setData] = useState({
    title: "",
    slug: "",
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
        createPageType(data, id, "create").then((res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Page Type Page");
            router.refresh();
            router.push(`/app/site/${id}`);
            modal?.hide();
            toast.success(`Successfully created page type!`);
          }
        })
      }
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl dark:text-white">Create a Page Folder</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Folders group pages into categories like <span className="font-medium text-stone-500">/services</span> to improve navigation and search ranking.
        </p>
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Folder Type
          </label>
          <input
            name="title"
            type="text"
            placeholder="Page Folder Name"
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
              placeholder="folder-name /"
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
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <CreatePageTypeFormButton />
      </div>
    </form>
  );
}
function CreatePageTypeFormButton() {
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
      {pending ? <LoadingDots color="#808080" /> : <p>Add Folder</p>}
    </button>
  );
}