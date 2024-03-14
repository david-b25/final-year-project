import React from "react";
import useDesigner from "@/editor/hooks/use-designer";
import { PageElements } from "@/editor/page-elements";
import { ChevronRight } from "lucide-react";
import { SitePage } from "@prisma/client";


export default function NavbarRight({sitePages}: {sitePages: SitePage[]}){
    const { selectedElement, setSelectedElement } = useDesigner();
    if (!selectedElement) return null;
    if (!sitePages) return null;

    const PropertiesForm = PageElements[selectedElement?.type].propertiesComponent;

    return(
        selectedElement ? 
        <aside className="w-[400px] max-w-[400px]  flex flex-col flex-grow  overflow-y-auto h-full bg-white border-l border-stone-300 ">
            <div className="flex items-center justify-between text-sm text-stone-600 font-medium h-10 min-h-10 px-2 text-left border-b border-stone-300 bg-stone-100 ">
                Edit Component
                <button onClick={() => {
                    setSelectedElement(null);
                }}>
                    <div className="flex items-center h-6 w-6 border border-stone-300 rounded-full bg-white">
                    <ChevronRight className="h-3" />
                    </div>
                </button>
            </div>
            <div className="w-full">
                <PropertiesForm elementInstance={selectedElement} sitePages={sitePages} />
            </div>
        </aside>
        : null
    );
};





