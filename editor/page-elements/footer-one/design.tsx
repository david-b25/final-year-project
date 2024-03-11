"use client";
import { Site } from "@prisma/client"
import { PageElementInstance } from "@/editor/page-elements";
import Link from "next/link";

import { radiusMapper } from "@/styles/radius";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";
import Image from "next/image";

import { fontMapper } from "@/styles/fonts";

interface FooterLink {
  title: string;
  link: string;
  key: string;
}

const extraAttributes = {
  backgroundColour: "#FFFFFF",

  description: {
      text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt consequuntur amet culpa cum itaque neque.",
      textColour: "#333333",
  },

  linksTitles: {
      textOne: "Explore",
      textColourOne: "#333333",

      textTwo: "Contact Us",
      textColourTwo: "#333333",
  },

  linksColour: "#333333",

  linksOne: [] as FooterLink[],
  linksTwo: [] as FooterLink[],

  copyright: {
      text: "© Copyright 2024 SiteUp. All Rights Reserved.",
      textColour: "#333333",
  },

  linksThree: [] as FooterLink[],
}

type CustomInstance = PageElementInstance & {
    extraAttributes: typeof extraAttributes;
}

export function Design({ site, elementInstance }: { site: Site, elementInstance: PageElementInstance}) {
  const element = elementInstance as CustomInstance;
  
  const { backgroundColour, description, linksTitles, linksColour, linksOne, linksTwo, copyright, linksThree  } = element.extraAttributes;


  return (
    <div className={`${fontMapper[site.font]}`}>
      <footer style={{ backgroundColor: backgroundColour }}>
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div>
                  <div>
                      <Link href="/">
                          <Image
                              alt={site.name || ""}
                              height={100}
                              src={site.logo || ""}
                              width={100}
                          />
                      </Link>
                  </div>

                  <p style={{ color: description.textColour }} className="text-base font-title mt-6 max-w-md text-center leading-relaxed text-gray-500 sm:max-w-xs sm:text-left">
                      {description.text}
                  </p>

          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
              <div></div>
              <div></div>
              <div className="text-center sm:text-left">
                  <p style={{ color: linksTitles.textColourOne }} className="font-title text-lg font-medium text-gray-900">{linksTitles.textOne}</p>
                  <ul className="mt-8 space-y-4 text-sm">
                      {linksOne.map((linkOne) => (
                          <li key={linkOne.key}>
                              <Link 
                                  style={{ color: linksColour }} 
                                  href={linkOne.link}
                                  className="text-base font-title  text-gray-700 transition hover:text-gray-700/75"
                              >
                                  {linkOne.title}
                              </Link>
                          </li>
                      ))}
                  </ul>
              </div>

              <div className="text-center sm:text-left">
                  <p style={{ color: linksTitles.textColourTwo }} className="font-title text-lg font-medium text-gray-900">{linksTitles.textTwo}</p>
                  <ul className="mt-8 space-y-4 text-sm">
                      {linksTwo.map((linkTwo) => (
                          <li key={linkTwo.key}>
                              <Link 
                                  style={{ color: linksColour }} 
                                  href={linkTwo.link}
                                  className="text-base font-title text-gray-700 transition hover:text-gray-700/75"
                              >
                                  {linkTwo.title}
                              </Link>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
          </div>

          <div className="mt-12 border-t border-gray-100 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
              <div>
                  {linksThree.map((linkThree) => (
                      <Link
                      style={{ color: linksColour }} 
                      key={linkThree.key}
                      className="ml-4 text-sm inline-block font-title text-teal-600 underline transition hover:text-teal-600/75"
                      href="/"
                      >
                          {linkThree.title}
                      </Link>
                  ))}
              </div>
              <p style={{ color: copyright.textColour }} className="font-title mt-4 text-sm text-gray-500 sm:order-first sm:mt-0">{copyright.text}</p>
          </div>
          </div>
      </div>
      </footer>
      </div>
  );
}