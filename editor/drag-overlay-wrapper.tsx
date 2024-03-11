import { Active, useDndMonitor, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import { PageElements } from "./page-elements";
import { SidebarButtonElementDragOverlay } from "./sidebar-button-element";
import { ElementsType } from "./page-elements";
import useDesigner from "@/editor/hooks/use-designer";
import { Site } from "@prisma/client";

export default function DragOverlayWrapper ({site}: {site: Site}){
    const { elements } = useDesigner();
    const [draggedItem, setDraggedItem] = useState<Active | null>(null);
    useDndMonitor({
        onDragStart: (event) => {
            setDraggedItem(event.active);
        },
        onDragCancel: () => {
            setDraggedItem(null);
        },
        onDragEnd: () => {
            setDraggedItem(null);
        },
    });

    if(!draggedItem) return null;

    let node = <div>No Drag Overlay</div>
    const isSidebarButtonElement = draggedItem.data?.current?.isDesignerButtonElement;

    if(isSidebarButtonElement){
        const type = draggedItem.data?.current?.type as ElementsType;
        node = <SidebarButtonElementDragOverlay pageElement={PageElements[type]} />
    }

    const isDesignerElement = draggedItem.data?.current?.isDesignerElement;
    if(isDesignerElement){
        const elementId = draggedItem.data?.current?.elementId;
        const  element = elements.find(el => el.id === elementId);
        if(!element) {
            node = <div>Element not found</div>
        } else {
            const DesignerElementComponent = PageElements[element.type].designerComponent;
            node = <div className="bg-white w-full opacity-80 pointer pointer-events-none">
                <DesignerElementComponent site={site} elementInstance={element} />
            </div>
        }
    }

    return( 
    <DragOverlay>{node}</DragOverlay>
    )
}