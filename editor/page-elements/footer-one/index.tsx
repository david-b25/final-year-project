import { ElementsType, PageElement, PageElementInstance } from "@/editor/page-elements";
import { idGenerator } from "@/lib/utils";

import { Render } from "./render";
import { Update } from "./update";
import { Design } from "./design";


const type: ElementsType = "FooterOne";

export const FooterOnePageElement: PageElement = {
    type,
    construct: (id: string) => ({
        id, 
        type,
        extraAttributes: {
            backgroundColour: "#FFFFFF",

            description: {
                text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt consequuntur amet culpa cum itaque neque.",
                textColour: "#333333",
            },
        
            linksTitles: {
                textOne: "Explore",
                textColourOne: "#333333",
        
                textTwo: "Contact Us",
                textColourTwo: "#333333",
            },
        
            linksColour: "#333333",

            linksOne: [
                { 
                    title: "Home",
                    link: "/",
                    key: idGenerator(),
                },
            ],

            linksTwo: [
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
            
            copyright: {
                text: "© Copyright 2024 SiteUp. All Rights Reserved.",
                textColour: "#333333",
            },
        
            linksThree: [
                { 
                    title: "Privacy Policy",
                    link: "/",
                    key: idGenerator(),
                },
                { 
                    title: "Terms & Conditions",
                    link: "/",
                    key: idGenerator(),
                },
                { 
                    title: "Cookie Policy",
                    link: "/",
                    key: idGenerator(),
                },
            ],
        },
    }),

    designerButtonElement: {
        image: "/footer-one.png", 
        label: "Footer One",
    },

    designerComponent: (props) => <Design {...props} />,
    pageComponent: (props) => <Render {...props} />,
    propertiesComponent: (props) => <Update {...props} />,
};




