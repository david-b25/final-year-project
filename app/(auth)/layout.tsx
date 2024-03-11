import Link from "next/link";
import Image from "next/image";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100vh] bg-black">
      <main className="flex items-center justify-center h-full">
        {children}
      </main>
    </div>
   );
}
