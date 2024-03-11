import { ReactNode, Suspense } from "react";
import { UserButton } from "@clerk/nextjs";
import { UserProfile } from "@clerk/nextjs";
import Nav from "@/components/nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Nav>
        <Suspense fallback={<div>Loading...</div>}>
          <UserButton />
        </Suspense>
      </Nav>
      <div className="min-h-screen dark:bg-black sm:pl-60">{children}</div>
    </div>
  );
}
