import { Site } from "@prisma/client"
import { PageElementInstance } from "@/editor/page-elements";

import Link from "next/link";

import { radiusMapper } from "@/styles/radius";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";


const extraAttributes = {

    backgroundColour: "#FFFFFF",
    
    tagline: {
        text: "Welcome to SiteUp",
        textColour: "#333333",
    },

    longText: {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittis eros. Quisque quis euismod lorem. Etiam sodales ac felis id interdum.",
        textColour: "#333333",
    },

}

type CustomInstance = PageElementInstance & {
    extraAttributes: typeof extraAttributes;
}

export async function Render({ site, elementInstance }: { site: Site, elementInstance: PageElementInstance}) {
    const element = elementInstance as CustomInstance;
    
    const { backgroundColour, tagline, longText } = element.extraAttributes;

    return (
        <section style={{ backgroundColor: backgroundColour }}>
            <div
                className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-32"
            >
                <div className="lg:py-8">
                    <h2 style={{ color: tagline.textColour }} className="font-title text-sm uppercase leading-7 mb-4">
                        {tagline.text}
                    </h2>

                    <p style={{ color: longText.textColour }} className="font-title whitespace-pre-line text-base mb-8">
                        {longText.text}
                    </p>
                </div>
            </div>
        </section>
    );
}