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

export function Design({site, elementInstance}: {site: Site, elementInstance: PageElementInstance}) {
  const element = elementInstance as CustomInstance;

  const { image, backgroundColour, tagline, title, paragraph, button} = element.extraAttributes;

    return (
      <div className={`${fontMapper[site.font]}`}>
        <section style={{ backgroundColor: backgroundColour }}>
            <div
            className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8"
            >
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">

                    <div className="lg:py-8">
                        <h2 style={{ color: tagline.textColour }} className="text-sm font-title uppercase leading-7 mb-4">
                            {tagline.text}
                        </h2>

                        <h2 style={{ color: title.textColour }} className="mb-8 font-title lg:text-4xl text-4xl">
                            {title.text}
                        </h2>

                        <p style={{ color: paragraph.textColour }} className="text-base font-title mb-8">
                            {paragraph.text}
                        </p>

                        <div className="mt-4 md:mt-8">
                            <Link
                            href={button.link}
                            style={{ backgroundColor: button.backgroundColour, color: button.textColour }}
                            className={`inline-block text-base font-title font-medium px-12 py-3  ${radiusMapper[site.buttonRadius]}`}
                            >
                                {button.text}
                                <span className="ml-2" aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>

                    <div
                        className="relative h-64 overflow-hidden sm:h-80 lg:order-first lg:h-full"
                    >
                        <BlurImage
                            alt={"Test image"}
                            width={1200}
                            height={350}
                            className="absolute inset-0 h-[500px] w-full object-cover object-center"
                            placeholder="blur"
                            blurDataURL={placeholderBlurhash}
                            src={image ?? "/placeholder.png"}
                        />
                    </div>
                </div>
            </div>
        </section>
      </div>
    );
}