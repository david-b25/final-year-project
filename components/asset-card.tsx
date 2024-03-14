import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";
import { Asset, Site } from "@prisma/client";
import Link from "next/link";

export default function AssetCard({
  data,
}: {
  data: Asset & { site: Site | null };
}) {

  return (
    <div className="relative rounded-lg border border-stone-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      <Link
        href=''
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <div className="relative h-44 overflow-hidden">
          <BlurImage
            alt={"Asser thumbnail"}
            width={500}
            height={400}
            className="h-full object-cover"
            src={data.image ?? "/placeholder.png"}
            placeholder="blur"
            blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
          />
        </div>
      </Link>
    </div>
  );
}
