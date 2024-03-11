import { ElementsType, PageElement, PageElementInstance } from "@/editor/page-elements";

import { Render } from "./render";
import { Update } from "./update";
import { Design } from "./design";
import { idGenerator } from "@/lib/utils";


const type: ElementsType = "TextTwo";

export const TextTwoPageElement: PageElement = {
    type,
    construct: (id: string) => ({
        id, 
        type,
        extraAttributes: {
            backgroundColour: "#FFFFFF",

            longText: {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittis eros. Quisque quis euismod lorem. Etiam sodales ac felis id interdum.",
                textColour: "#333333",
            },

            linksTitle: {
                text: "Welcome to SiteUp",
                textColour: "#333333",
            },

            linksBackgroundColour: "#333333",
            linksColour: "#FFFFFF",

            links: [
                { 
                    title: "email@siteup.ai",
                    link: "/",
                    key: idGenerator(),
                },
                { 
                    title: "+1 555 123 4567",
                    link: "/",
                    key: idGenerator(),
                },
                { 
                    title: "Galway, Ireland",
                    link: "/",
                    key: idGenerator(),
                },
            ],
        },
    }),

    designerButtonElement: {
        image: "/text-two.png", 
        label: "Text Two",
    },

    designerComponent: (props) => <Design {...props} />,
    pageComponent: (props) => <Render {...props} />,
    propertiesComponent: (props) => <Update {...props} />,
};


