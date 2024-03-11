"use client";
import { Site } from "@prisma/client"
import { PageElementInstance } from "@/editor/page-elements";

import Link from "next/link";

import { radiusMapper } from "@/styles/radius";
import { fontMapper } from "@/styles/fonts";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";


interface ContactLink {
    title: string;
    link: string;
    key: string;
}


const extraAttributes = {

    backgroundColour: "#FFFFFF",

    longText: {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittis eros. Quisque quis euismod lorem. Etiam sodales ac felis id interdum.",
        textColour: "#333333",
    },

    linksTitle: {
        text: "Welcome to SiteUp",
        textColour: "#333333",
    },

    linksBackgroundColour: "#333333",
    linksColour: "#FFFFFF",

    links: [] as ContactLink[],
}

type CustomInstance = PageElementInstance & {
    extraAttributes: typeof extraAttributes;
}

export function Design({ site, elementInstance }: { site: Site, elementInstance: PageElementInstance}) {
    const element = elementInstance as CustomInstance;
    
    const { backgroundColour, longText, linksTitle, linksBackgroundColour, linksColour, links } = element.extraAttributes;

    return (
        <div className={`${fontMapper[site.font]}`}>
              <section style={{ backgroundColor: backgroundColour }}>
                <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">

                    <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-6">
                        <div className="lg:col-span-4 lg:py-12">
                            <article className="space-y-4 text-gray-600">
                            <p style={{ color: longText.textColour }} className="font-title whitespace-pre-line text-base">
                                {longText.text}
                            </p>
                            </article>
                        </div>
                        <div style={{ backgroundColor: linksBackgroundColour }} className="rounded-lg bg-white p-8 shadow-md lg:col-span-2 lg:p-12">
                            <div className="w-full text-center sm:text-left">
                                <p style={{ color: linksTitle.textColour }} className="font-title text-lg font-medium">{linksTitle.text}</p>
                                <ul className="w-full mt-8 space-y-4">
                                    {links.map((link) => (
                                        <li key={link.key} className="border-b pb-2">
                                            <Link 
                                                style={{ color: linksColour }} 
                                                href={link.link}
                                                className="w-full text-md pb-2 font-title text-gray-700 transition hover:text-gray-700/75"
                                            >
                                               {link.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}