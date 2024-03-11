import Link from "next/link";
import Image from "next/image";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <main className="flex items-center justify-center h-full pt-40">
        {children}
      </main>
    </div>
   );
}
