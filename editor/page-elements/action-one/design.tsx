"use client";
import { Site } from "@prisma/client"
import { PageElementInstance } from "@/editor/page-elements";
import Link from "next/link";

import { radiusMapper } from "@/styles/radius";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";

import { fontMapper } from "@/styles/fonts";

const extraAttributes = {
  image: "https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/hxfcV5V-eInX3jbVUhjAt1suB7zB88uGd1j20b.png",

  backgroundColour: "#FFFFFF",

  title: {
      text: "Title Copy Goes Here",
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
    
    const { image, backgroundColour, title, button} = element.extraAttributes;

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
                    className="flex items-center relative mx-auto max-w-screen-xl px-4 py-8 lg:h-[600px] md:h-[500px] sm:px-6 lg:px-8"
                >
                    <div className="max-w-xl text-start">
                        <h1 style={{ color: title.textColour }} className="font-title text-4xl mb-8 sm:text-5xl">
                            {title.text}
                        </h1>

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
                </div>
            </div>
        </section>
      </div>
    );
}