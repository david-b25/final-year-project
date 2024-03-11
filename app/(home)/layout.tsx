import Navbar from "./_components/navbar";
import Canvas from "./canvas";

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
        <Canvas/>
      </div>
   );
}
