import { ReactNode, Suspense } from "react";
import Nav from "@/components/nav";
import { UserButton } from "@clerk/nextjs";


export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex flex-col space-y-12 p-8">
        <div className="flex flex-col space-y-6">{children}</div>
      </div>
    </>
  );
}