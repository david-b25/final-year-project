import { Site } from "@prisma/client"
import { PageElementInstance } from "@/editor/page-elements";

import Link from "next/link";

import { radiusMapper } from "@/styles/radius";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";


const extraAttributes = {
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
}

type CustomInstance = PageElementInstance & {
    extraAttributes: typeof extraAttributes;
}

export async function Render({ site, elementInstance }: { site: Site, elementInstance: PageElementInstance}) {
    const element = elementInstance as CustomInstance;
    
    const { image, backgroundColour, tagline, title, paragraph, button} = element.extraAttributes;

    return (
            <section style={{ backgroundColor: backgroundColour }} className="overflow-hidden md:grid md:grid-cols-2">
                <div className="my-32 p-8 md:p-12 lg:px-16 lg:py-24">
                    <div className="mx-auto max-w-xl text-start ltr:sm:text-left rtl:sm:text-right">
                        <h2 style={{ color: tagline.textColour }} className="font-title text-sm uppercase leading-7 mb-8">
                            {tagline.text}
                        </h2>
                        <h1 style={{ color: title.textColour }} className="font-title text-5xl mb-8 md:text-6xl">
                            {title.text}
                        </h1>
                        <p style={{ color: paragraph.textColour }} className="font-title whitespace-pre-line text-lg mb-8 md:mt-4 md:block">
                            {paragraph.text}
                        </p>
                        <div className="mt-4 md:mt-8">
                            <Link
                            href={button.link}
                            style={{ backgroundColor: button.backgroundColour, color: button.textColour }}
                            className={`inline-block text-base font-title font-medium px-12 py-3  ${radiusMapper[site.buttonRadius]}`}
                            >
                                {button.text}
                            </Link>
                        </div>
                    </div>
                </div>
        
                <BlurImage
                  alt={"Test image"}
                  width={1200}
                  height={630}
                  className="h-full w-full object-cover md:h-full"
                  placeholder="blur"
                  blurDataURL={placeholderBlurhash}
                  src={image ?? "/placeholder.png"}
                />
            </section>
    );
}