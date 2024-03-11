
import { ReactNode, Suspense } from "react";
import { auth } from "@clerk/nextjs";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import DesignerContextProvider from "@/editor/context/designer-context";


export default async  function EditorLayout({ 
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const data = await prisma.sitePage.findUnique({
    where: {
      userId: userId,
      id: decodeURIComponent(params.id),
    },
  });

  if (!data || data.userId !== userId) {
    notFound();
  }

  return (
    <DesignerContextProvider>
      <div className="flex flex-col min-h-screen min-w-full max-h-screen">
        <main className="flex w-full flex-grow">{children}</main> 
      </div>
    </DesignerContextProvider>
  )
}