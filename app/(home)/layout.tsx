import Navbar from "./_components/navbar";
import CanvasComponent from './canvas';

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div>
        <Navbar />
        <main className="h-full pt-40">
          {children}
        </main>
        <CanvasComponent />
      </div>
   );
}
