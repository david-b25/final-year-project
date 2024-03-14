import { ReactNode, Suspense } from "react";
import { UserButton } from "@clerk/nextjs";
import Navbar from "@/components/navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar>
          <Suspense fallback={<div>Loading...</div>}>
            <UserButton />
          </Suspense>
      </Navbar>
      <div className="min-h-screen">{children}</div>
    </div>
  );
}
