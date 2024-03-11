import { ElementsType, PageElement, PageElementInstance } from "@/editor/page-elements";

import { Render } from "./render";
import { Update } from "./update";
import { Design } from "./design";


const type: ElementsType = "HeaderTwo";

export const HeaderTwoPageElement: PageElement = {
    type,
    construct: (id: string) => ({
        id, 
        type,
        extraAttributes: {
            image: "https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/hxfcV5V-eInX3jbVUhjAt1suB7zB88uGd1j20b.png",

            backgroundColour: "#FFFFFF",
            
            tagline: {
                text: "Welcome to SiteUp",
                textColour: "#333333",
            },

            title: {
                text: "Title Copy Goes Here",
                textColour: "#333333",
            },

            paragraph: {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittis eros. Quisque quis euismod lorem. Etiam sodales ac felis id interdum.",
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
        image: "/header-two.png", 
        label: "Header Two",
    },

    designerComponent: (props) => <Design {...props} />,
    pageComponent: (props) => <Render {...props} />,
    propertiesComponent: (props) => <Update {...props} />,
};




