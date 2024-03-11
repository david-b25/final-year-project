import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SiteCard from "./site-card";
import Image from "next/image";

export default async function Sites({ limit }: { limit?: number }) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const sites = await prisma.site.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "asc",
    },
    ...(limit ? { take: limit } : {}),
  });

  return sites.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {sites.map((site) => (
        <SiteCard key={site.id} data={site} />
      ))}
    </div>
  ) : (
    <div className="mt-30 border border-border rounded-lg flex flex-col items-center space-x-4">
      <h1 className="mt-20 font-cal text-4xl">No Sites Yet</h1>
      <Image
        alt="missing site"
        src="/designer-placeholder.svg"
        width={400}
        height={400}
      />
      <p className="mb-30 text-lg text-stone-500">
        You do not have any sites yet. Create one to get started.
      </p>
    </div>
  );
}
