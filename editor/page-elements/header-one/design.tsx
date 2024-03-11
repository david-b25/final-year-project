"use client";
import { Site } from "@prisma/client"
import { PageElementInstance } from "@/editor/page-elements";

import Link from "next/link";

import { radiusMapper } from "@/styles/radius";
import { fontMapper } from "@/styles/fonts";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";
import Image from "next/image";


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
}

type CustomInstance = PageElementInstance & {
    extraAttributes: typeof extraAttributes;
}

export function Design({ site, elementInstance }: { site: Site, elementInstance: PageElementInstance}) {
    const element = elementInstance as CustomInstance;
    
    const { image, backgroundColour, tagline, title, paragraph } = element.extraAttributes;

    return (
        <div className={`${fontMapper[site.font]}`}>
            <section>
                <div className="relative bg-cover bg-center bg-no-repeat">
                    <BlurImage
                        alt={"Test image"}
                        width={1200}
                        height={100}
                        className="absolute lg:h-[600px] md:h-[500px] w-full object-cover object-center"
                        placeholder="blur"
                        blurDataURL={placeholderBlurhash}
                        src={image ?? "/placeholder.png"}
                    />
                </div>

                <div className="backdrop-brightness-50">
                    <div
                        className="flex items-center justify-center relative mx-auto max-w-screen-xl px-4 py-32 lg:h-[600px] md:h-[500px] sm:px-6 lg:px-8"
                    >
                        <div className="max-w-xl text-center">
                            <h2 style={{ color: tagline.textColour }} className="font-title text-sm uppercase leading-7 mb-4">
                                {tagline.text}
                            </h2>
                            <h2 style={{ color: title.textColour }} className="font-title mb-8 lg:text-4xl text-4xl">{title.text}</h2>

                            <p style={{ color: paragraph.textColour }} className="font-title whitespace-pre-line text-base mb-8">
                                {paragraph.text}
                            </p>
                        </div>
                    </div>
                </div>
        </section>
        </div>
    );
}