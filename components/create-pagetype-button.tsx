"use client";

import { useModal } from "@/components/modal/provider";
import { ReactNode } from "react";
import { Button } from "@/editor/ui/button";
import { FolderPlus } from "lucide-react";


export default function CreatePageTypeButton({
  children,
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="rounded-lg  px-2 py-1 text-sm text-stone-500 hover:bg-black hover:text-white"
      onClick={() => modal?.show(children)}
    >
      <FolderPlus className="h-3" />
    </Button>
  );
}

    