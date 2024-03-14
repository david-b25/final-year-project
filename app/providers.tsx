"use client";

import { Toaster } from "sonner";
import { ModalProvider } from "@/components/modal/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <ModalProvider>{children}</ModalProvider>
    </>
  );
}
