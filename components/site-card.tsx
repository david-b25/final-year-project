import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";
import { Site } from "@prisma/client";
import Link from "next/link";

export default function SiteCard({ data }: { data: Site }) {
  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  return (
    <div className="relative rounded-lg border border-stone-200 pb-10 shadow-md transition-all hover:shadow-xl">
      <Link
        href={`/app/site/${data.id}`}
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <BlurImage
          alt={data.name ?? "Site thumbnail"}
          width={500}
          height={400}
          className="h-44 object-cover"
          src={data.image ?? "/placeholder.png"}
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
        />
        <div className="border-t border-stone-200 p-4">
          <h3 className="my-0 truncate font-cal text-xl font-bold tracking-wide">
            {data.name}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm font-normal leading-snug text-stone-500">
            {data.description}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-4 flex w-full justify-between space-x-4 px-4">
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.subdomain}.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
        >
          {url} ↗
        </a>
      </div>
    </div>
  );
}
