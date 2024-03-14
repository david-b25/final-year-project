import Navbar from "./_components/navbar";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div>
        <Navbar />
        <main className="h-full">
          {children}
        </main>
      </div>
   );
}
