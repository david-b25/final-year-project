"use client";

import NavbarLeft from "./nav-left";
import { PageElementInstance, PageElements, ElementsType } from "./page-elements";
import { cn } from "@/lib/utils";
import useDesigner from "@/editor/hooks/use-designer";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import { idGenerator } from "@/lib/utils";
import { useState } from "react";
import DesignerPlaceholder from "@/editor/designer-placeholder";
import NavbarRight from "./nav-right";
import { toast } from "sonner";
import { Site, SitePage } from "@prisma/client";


export default function Designer({site, sitePage, sitePages, displaySize}: {site: Site, sitePage: SitePage, sitePages: SitePage[], displaySize: "large" | "medium" | "small"}){

    const {elements, addElement, selectedElement, setSelectedElement, removeElement} = useDesigner();

    const droppable = useDroppable({
        id: "designer-drop-area",
        data:{
            isDesignerDropArea: true,
        }
    });

    useDndMonitor({
        onDragEnd: (event) => {
            const {active, over} = event;
            if(!active || !over) return;

            const isDesignerButtonElement = active.data?.current?.isDesignerButtonElement;
            const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea;

            const droppingSidebarButtonOverDesignerDropArea = isDesignerButtonElement && isDroppingOverDesignerDropArea;
            if(droppingSidebarButtonOverDesignerDropArea){
                const type = active.data?.current?.type;
                
                // Check if the type starts with Navbar or Footer
                if (type.startsWith('Navbar') || type.startsWith('Footer')) {
                    const alreadyExists = elements.some(el => el.type.startsWith(type));
                    if (alreadyExists) {
                        toast.error("You can only have one navbar and one footer at a time.");
                        return;
                    }
                }

                const newElement = PageElements[type as ElementsType].construct(
                    idGenerator()
                );
                addElement(elements.length, newElement);
                return;
            }

            const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement;
            const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement;
      
            const isDroppingOverDesignerElement =
              isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;
      
            const droppingSidebarButtonOverDesignerElement = isDesignerButtonElement && isDroppingOverDesignerElement;
      
            // Second scenario
            if (droppingSidebarButtonOverDesignerElement) {
              const type = active.data?.current?.type;
              const newElement = PageElements[type as ElementsType].construct(idGenerator());
      
              const overId = over.data?.current?.elementId;
      
              const overElementIndex = elements.findIndex((el) => el.id === overId);
              if (overElementIndex === -1) {
                throw new Error("element not found");
              }
      
              let indexForNewElement = overElementIndex; // i assume i'm on top-half
              if (isDroppingOverDesignerElementBottomHalf) {
                indexForNewElement = overElementIndex + 1;
              }
      
              addElement(indexForNewElement, newElement);
              return;
            }
      
            // Third scenario
            const isDraggingDesignerElement = active.data?.current?.isDesignerElement;
      
            const draggingDesignerElementOverAnotherDesignerElement =
              isDroppingOverDesignerElement && isDraggingDesignerElement;
      
            if (draggingDesignerElementOverAnotherDesignerElement) {
              const activeId = active.data?.current?.elementId;
              const overId = over.data?.current?.elementId;
      
              const activeElementIndex = elements.findIndex((el) => el.id === activeId);
      
              const overElementIndex = elements.findIndex((el) => el.id === overId);
      
              if (activeElementIndex === -1 || overElementIndex === -1) {
                throw new Error("element not found");
              }
      
              const activeElement = { ...elements[activeElementIndex] };
              removeElement(activeId);
      
              let indexForNewElement = overElementIndex; // i assume i'm on top-half
              if (isDroppingOverDesignerElementBottomHalf) {
                indexForNewElement = overElementIndex + 1;
              }
      
              addElement(indexForNewElement, activeElement);
            }
          },
        });


    return(
        <div className="flex w-full h-full">
            <div className="flex w-full" onClick={() => {
                if(selectedElement) setSelectedElement(null);
            }}>
                <NavbarLeft sitePage={sitePage}/>
                <div
                    ref={droppable.setNodeRef}
                    className={cn("max-w-[920px] bg-white h-full m-auto flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
                    {
                        'max-w-full': displaySize === "large",
                        'max-w-[920px]': displaySize === "medium",
                        'max-w-[350px]': displaySize === "small"
                    },
                    droppable.isOver && "ring-4 ring-primary ring-inset",
                  )}
                >
                    {!droppable.isOver && elements.length === 0 && (
                        <DesignerPlaceholder />
                    )}

                    {droppable.isOver && elements.length === 0 && (
                        <div className="p-4 w-full">
                        <div className=""></div>
                        </div>
                    )}

                    {elements.length > 0 && (
                        <div className="w-full">
                        {elements.map((element) => (
                            <DesignerElementWrapper site={site} key={element.id} element={element} />
                        ))}
                        </div>
                    )}

                </div>
            </div>
            <NavbarRight sitePages={sitePages} />
        </div>
    )
}

function DesignerElementWrapper({site, element}: {site: Site, element: PageElementInstance}){
    const { removeElement, selectedElement, setSelectedElement } = useDesigner();

    const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);

    const topHalf = useDroppable({
        id: element.id + "-top",
        data: {
            type: element.type,
            elementId: element.id,
            isTopHalfDesignerElement: true,
        }
    });

    const bottomHalf = useDroppable({
        id: element.id + "-bottom",
        data: {
            type: element.type,
            elementId: element.id,
            isBottomHalfDesignerElement: true,
        }
    });

    const draggable = useDraggable({
        id: element.id + "-drag-handler",
        data: {
            type: element.type,
            elementId: element.id,
            isDesignerElement: true,
        },
    });

    if (draggable.isDragging) {
        return null;
    }
    
    const DesignerElement = PageElements[element.type].designerComponent;
    return (
        <div 
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
            onClick={(e) => {
                e.stopPropagation();
                setSelectedElement(element)
            }}
            className="relative h-auto w-full text-foreground hover:cursor-pointer ring-1 ring-black ring-inset"
        >
            <div 
                ref={topHalf.setNodeRef} 
                className="absolute w-full h-1/2"
            />
            <div   
                ref={bottomHalf.setNodeRef}
                className="absolute w-full bottom-0 h-1/2" 
            />
            {mouseIsOver && (
                <>
                    <div className="absolute z-50 top-0 w-full bg-[#0076FD] h-[2px]" />
                    <div className="absolute z-50 bottom-0 w-full bg-[#0076FD] h-[2px]" />
                    <div className="absolute z-50 left-0 h-full bg-[#0076FD] w-[2px]" />
                    <div className="absolute z-50 right-0 h-full bg-[#0076FD] w-[2px]" />
                    <div className="absolute z-50 bottom-0 w-full flex items-center justify-center"> 
                        <div className="rounded-t-lg px-3 pt-1 pb-0.5 text-white text-sm font-medium bg-[#0076FD]">Click to Edit</div>
                    </div>
                </>
            )}
            {topHalf.isOver && 
                <div className="absolute z-50 top-0 w-full bg-[#0076FD] h-[7px]" />
            }

            {bottomHalf.isOver && 
                <div className="absolute z-50 bottom-0 w-full bg-[#0076FD] h-[7px]" />
            }


            <div className={cn(
                    "w-full items-center pointer-events-none opacity-100",
                    mouseIsOver && "opacity-100"
                )}
            >
                <DesignerElement site={site} elementInstance={element}/>
            </div>
        </div>
    )
};