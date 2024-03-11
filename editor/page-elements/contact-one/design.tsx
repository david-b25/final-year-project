"use client";
import { Site } from "@prisma/client"
import { PageElementInstance } from "@/editor/page-elements";

import Link from "next/link";

import { radiusMapper } from "@/styles/radius";
import { fontMapper } from "@/styles/fonts";
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

    linkTitles: {
        textOne: "Explore",
        textColourOne: "#333333",

        textTwo: "Contact Us",
        textColourTwo: "#333333",

        textThree: "Contact Us",
        textColourThree: "#333333",
    },

    links: {
        textOne: "Explore",
        textColourOne: "#333333",

        textTwo: "Contact Us",
        textColourTwo: "#333333",

        textThree: "Contact Us",
        textColourThree: "#333333",
    },
}

type CustomInstance = PageElementInstance & {
    extraAttributes: typeof extraAttributes;
}

export function Design({site, elementInstance}: {site: Site, elementInstance: PageElementInstance}) {
    const element = elementInstance as CustomInstance;
    
    const { image, backgroundColour, tagline, title, paragraph, linkTitles, links } = element.extraAttributes;

    return (
      <div className={`${fontMapper[site.font]}`}>
        <section style={{ backgroundColor: backgroundColour }}>
                <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                    <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-6">
                        <div className="lg:col-span-3 lg:py-12">
                            <div className="relative h-64 overflow-hidden sm:h-80 lg:order-first lg:h-full">
                                <BlurImage
                                    alt={"Test image"}
                                    width={1200}
                                    height={600}
                                    className="absolute inset-0 w-full object-cover object-center"
                                    placeholder="blur"
                                    blurDataURL={placeholderBlurhash}
                                    src={image ?? "/placeholder.png"}
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-3">
                            <div className="w-full text-center sm:text-left">
                                <div className="border-b">
                                    <h2 style={{ color: tagline.textColour }} className="text-sm font-title uppercase leading-7 mb-4">
                                        {tagline.text}
                                    </h2>

                                    <h2 style={{ color: title.textColour }} className="mb-8 font-title lg:text-4xl text-4xl">
                                        {title.text}
                                    </h2>

                                    <p style={{ color: paragraph.textColour }} className="text-base font-title mb-8">
                                        {paragraph.text}
                                    </p>
                                </div>
                                <ul className="w-full mt-8 space-y-4">
                                    <li className="pb-2">
                                        <p style={{ color: linkTitles.textColourOne }} className="font-title text-sm font-medium">{linkTitles.textOne}</p>
                                        <Link 
                                            style={{ color: links.textColourOne }} 
                                            href="/"
                                            className="w-full text-md py-4 font-title text-gray-700 transition hover:text-gray-700/75"
                                        >
                                            {links.textOne}
                                        </Link>
                                    </li>

                                    <li className="pb-2">
                                        <p style={{ color: linkTitles.textColourTwo }} className="font-title text-sm font-medium">{linkTitles.textTwo}</p>
                                        <Link 
                                            style={{ color: links.textColourTwo }} 
                                            href="/"
                                            className="w-full text-md py-4 font-title text-gray-700 transition hover:text-gray-700/75"
                                        >
                                            {links.textTwo}
                                        </Link>
                                    </li>

                                    <li className="pb-2">
                                        <p style={{ color: linkTitles.textColourThree }} className="font-title text-sm font-medium">{linkTitles.textThree}</p>
                                        <Link 
                                            style={{ color: links.textColourThree }} 
                                            href="/"
                                            className="w-full text-md py-4 font-title text-gray-700 transition hover:text-gray-700/75"
                                        >
                                            {links.textThree}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
      </div>
    );
}