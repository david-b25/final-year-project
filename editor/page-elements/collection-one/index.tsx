import { ElementsType, PageElement, PageElementInstance } from "@/editor/page-elements";

import { CollectionOne } from "@/editor/page-elements/collection-one/render"
import { CollectionOneForm } from "@/editor/page-elements/collection-one/update"
import { DesignCollectionOne } from "@/editor/page-elements/collection-one/design"

const type: ElementsType = "CollectionOne";

export const CollectionOnePageElement: PageElement = {
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

            title: {
                text: "Title Copy Goes Here",
                textColour: "#333333",
            },

            paragraph: {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittis eros. Quisque quis euismod lorem. Etiam sodales ac felis id interdum.",
                textColour: "#333333",
            },
        },
    }),

    designerButtonElement: {
        image: "/collection-one.png", 
        label: "Collection One",
    },

    designerComponent: (props) => <DesignCollectionOne {...props} />,
    pageComponent: (props) => <CollectionOne {...props} />,
    propertiesComponent: (props) => <CollectionOneForm {...props} />,
};




