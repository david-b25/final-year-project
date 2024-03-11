"use client";
import { Site } from "@prisma/client"
import { PageElementInstance } from "@/editor/page-elements";

import Link from "next/link";

import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";
import { fontMapper } from "@/styles/fonts";

const extraAttributes = {
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

export function DesignCollectionOne({site, elementInstance}: {site: Site, elementInstance: PageElementInstance}) {
  const element = elementInstance as CustomInstance;

  const { backgroundColour, tagline, title, paragraph } = element.extraAttributes;

  return (
    <div className={`${fontMapper[site.font]}`}>
            <section style={{ backgroundColor: backgroundColour }}>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-lg text-center">
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
      
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                <Link href="#" className="block">
                    <BlurImage
                        alt="Collection Card"
                        width={500}
                        height={200}
                        className="h-64 w-full object-cover sm:h-80 lg:h-96"
                        src="/placeholder.png"
                        placeholder="blur"
                        blurDataURL={placeholderBlurhash}
                    />

                <h3 className="font-title mt-4 text-lg font-bold text-gray-900 sm:text-xl">Title goes here</h3>

                <p className="font-title mt-2 max-w-sm text-gray-700">
                    description goes here
                </p>
            </Link>
            
          </div>
        </div>
      </section>
    </div>
  )
}