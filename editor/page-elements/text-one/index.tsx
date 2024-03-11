import { ElementsType, PageElement, PageElementInstance } from "@/editor/page-elements";

import { Render } from "./render";
import { Update } from "./update";
import { Design } from "./design";


const type: ElementsType = "TextOne";

export const TextOnePageElement: PageElement = {
    type,
    construct: (id: string) => ({
        id, 
        type,
        extraAttributes: {
            backgroundColour: "#FFFFFF",
            
            tagline: {
                text: "Welcome to SiteUp",
                textColour: "#333333",
            },

            longText: {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittis eros. Quisque quis euismod lorem. Etiam sodales ac felis id interdum.",
                textColour: "#333333",
            },
        },
    }),

    designerButtonElement: {
        image: "/text-one.png", 
        label: "Text One",
    },

    designerComponent: (props) => <Design {...props} />,
    pageComponent: (props) => <Render {...props} />,
    propertiesComponent: (props) => <Update {...props} />,
};


