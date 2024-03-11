import { ElementsType, PageElement, PageElementInstance } from "@/editor/page-elements";

import { Render } from "./render";
import { Update } from "./update";
import { Design } from "./design";
import { idGenerator } from "@/lib/utils";

const type: ElementsType = "NavbarOne";

export const NavbarOnePageElement: PageElement = {
    type,
    construct: (id: string) => ({
        id, 
        type,
        extraAttributes: {
            backgroundColour: "#FFFFFF",

            button: {
                text: "Button",
                textColour: "#FFFFFF",
                link: "/",
                backgroundColour: "#333333",
            },   
            
            linksColour: "#333333",
            linksMobileColour: "#333333",
            
            links: [
                { 
                    title: "Home",
                    link: "/david",
                    key: idGenerator(),
                },
            ],
        },
    }),

    designerButtonElement: {
        image: "/navbar-one.png", 
        label: "Navbar One",
    },

    designerComponent: (props) => <Design {...props} />,
    pageComponent: (props) => <Render {...props} />,
    propertiesComponent: (props) => <Update {...props} />,
};




