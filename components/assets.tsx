import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AssetCard from "./asset-card";
import Image from "next/image";

export default async function Assets({
  siteId,
}: {
  siteId?: string;
}) {
  const {userId} =  auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const assets = await prisma.asset.findMany({
    where: {
      userId: userId as string,
      ...(siteId ? { siteId } : {}),
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      site: true,
    },
  });

  return assets.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {assets.map((asset) => (
        <AssetCard key={asset.id} data={asset} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Assets Yet</h1>
      <Image
        alt="missing assets"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any assets yet. Create one to get started.
      </p>
    </div>
  );
}
