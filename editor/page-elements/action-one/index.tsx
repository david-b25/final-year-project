import { ElementsType, PageElement, PageElementInstance } from "@/editor/page-elements";

import { Render } from "./render";
import { Update } from "./update";
import { Design } from "./design";


const type: ElementsType = "ActionOne";

export const ActionOnePageElement: PageElement = {
    type,
    construct: (id: string) => ({
        id, 
        type,
        extraAttributes: {
            image: "https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/hxfcV5V-eInX3jbVUhjAt1suB7zB88uGd1j20b.png",

            backgroundColour: "#FFFFFF",
        
            title: {
                text: "Title Copy Goes Here",
                textColour: "#333333",
            },

            button: {
                text: "Button",
                textColour: "#FFFFFF",
                link: "/",
                backgroundColour: "#333333",
            },   
        },
    }),

    designerButtonElement: {
        image: "/action-one.png", 
        label: "Action One",
    },

    designerComponent: (props) => <Design {...props} />,
    pageComponent: (props) => <Render {...props} />,
    propertiesComponent: (props) => <Update {...props} />,
};




