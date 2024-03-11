import React from "react";
import { PageElement } from "@/editor/page-elements";
import { Button } from "@/editor/ui/button";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function SidebarButtonElement({ pageElement }: { pageElement: PageElement }) {
  const { image, label } = pageElement.designerButtonElement;
  const draggable = useDraggable({
    id: `designer-btn-${pageElement.type}`,
    data: {
      type: pageElement.type,
      isDesignerButtonElement: true,
    },
  });

  return (
    <Button
      ref={draggable.setNodeRef}
      variant={"outline"}
      size={"draggable"}
      className={cn(
        "flex flex-col justify-between h-full w-full cursor-grab",
        draggable.isDragging && "ring-2 ring-primary",
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <Image
        alt={label}
        width={220}
        height={120}
        src={image || ""}
        className="rounded-lg"
      />
      <p className="text-stone-500 text-xs pt-1.5">{label}</p>
    </Button>
  );
}

export function SidebarButtonElementDragOverlay({ pageElement }: { pageElement: PageElement }) {
  const { image, label } = pageElement.designerButtonElement;

  return (
    <Button
      variant={"outline"}
      size={"draggable"}
      className="flex flex-col justify-between h-full w-full cursor-grab"
    >
      <Image
        alt={`${label} Component Preview Image`}
        width={220}
        height={120}
        src={image ?? "/placeholder.png"}
        className="rounded-lg"
      />
      <p className="text-stone-500 text-xs pt-1.5">{label}</p>
    </Button>
  );
}