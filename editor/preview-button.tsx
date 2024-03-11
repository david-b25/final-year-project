import React from "react";
import { Button } from "./ui/button";
import { Play } from "lucide-react";
import useDesigner from "@/editor/hooks/use-designer";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { PageElements } from "@/editor/page-elements";
import { Site } from "@prisma/client";
import { fontMapper } from "@/styles/fonts";

function PreviewButton({site}: {site: Site}){
  const { elements } = useDesigner();

  // <span className="text-sm font-medium">Preview</span>

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} size="sm" className="hidden md:flex w-10 py-1.5 transition-all hover:bg-black hover:text-white active:bg-stone-100">
          <Play className="h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-screen h-full max-w-full">
        <div className={`bg-white overflow-y-auto ${fontMapper[site.font]}`}>
          {elements.map((element) => {
              const DesignerComponent = PageElements[element.type].designerComponent;
              return <DesignerComponent key={element.id} elementInstance={element} site={site} />;
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewButton;