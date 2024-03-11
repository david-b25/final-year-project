import { Suspense } from "react";
import Sites from "@/components/sites";
import PlaceholderCard from "@/components/placeholder-card";
import CreateSite from "@/components/create-site";

export default function Overview() {
  return (
    <div className="flex flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between w-full border-b border-stone-200 pb-4">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            All Websites
          </h1>
          <div className="mr-4 md:mr-0">
            <Suspense fallback={null}>
              <CreateSite />
            </Suspense>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          <Sites limit={4} />
        </Suspense>
      </div>
    </div>
  );
}