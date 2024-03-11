import { Trash2 } from "lucide-react";
import { Button } from "@/editor/ui/button";
import useDesigner from "@/editor/hooks/use-designer";

export function DeleteButton({element}: {element: string}) {
    const { removeElement } = useDesigner();
    return (
            <div className="w-full px-2">
                <Button className="mb-8 w-full text-white flex justify-center rounded-lg border-none h-full bg-red-500"
                    variant={"destructive"}
                        onClick={(e) => {
                            e.stopPropagation();
                            removeElement(element);
                        }}
                >
                    Delete Section
                    <Trash2 className="h-4" />
                </Button>
            </div>
    )
}