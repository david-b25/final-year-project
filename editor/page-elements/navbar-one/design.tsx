"use client";
import { Site } from "@prisma/client"
import { PageElementInstance } from "@/editor/page-elements";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { radiusMapper } from "@/styles/radius";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";

import { fontMapper } from "@/styles/fonts";

interface NavbarLink {
  title: string;
  link: string;
  key: string;
}

const extraAttributes = {
  backgroundColour: "#FFFFFF",
  button: {
      text: "Button",
      textColour: "#FFFFFF",
      link: "/",
      backgroundColour: "#333333",
  },
  linksColour: "#333333",
  linksMobileColour: "#333333",
  links: [] as NavbarLink[],
}

type CustomInstance = PageElementInstance & {
    extraAttributes: typeof extraAttributes;
}

export function Design({site, elementInstance}: {site: Site, elementInstance: PageElementInstance}) {
  const element = elementInstance as CustomInstance;
  
  const { backgroundColour, button, linksColour, linksMobileColour, links } = element.extraAttributes;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
      setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className={`${fontMapper[site.font]}`}>
      <header>
          <div className="py-3 lg:py-4" style={{ backgroundColor: backgroundColour }}>
              <div className="px-5 md:px-10">
                  <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
                      <div>
                          <Link href="/">
                              <Image
                                  alt={site.name || ""}
                                  height={400}
                                  src={site.logo || ""}
                                  width={300}
                              />
                          </Link>
                      </div>
                      <div className="md:flex md:items-center md:gap-12">
                          <nav aria-label="Global" className="hidden md:block">
                              <ul className="flex items-center gap-8 text-sm">
                                  {links.map((link) => (
                                      <li key={link.link} className="text-base">
                                          <Link 
                                              style={{ color: linksColour }} 
                                              href={link.link}
                                              className="font-title"
                                          >
                                              {link.title}
                                          </Link>
                                      </li>
                                  ))}
                              </ul>
                          </nav> 
                          <div className="flex items-center gap-4">
                              <div className="md:flex md:gap-4">
                                  <Link
                                      style={{ backgroundColor: button.backgroundColour, color: button.textColour }}
                                      className={`inline-block text-base font-title font-medium px-12 py-3  ${radiusMapper[site.buttonRadius]}`}
                                      href={button.link}
                                  >
                                      {button.text}
                                  </Link>
                              </div>
                              <div className="block md:hidden">
                                  <button 
                                      className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
                                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                  >
                                      <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-5 w-5"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                      >
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                      </svg>
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          {mobileMenuOpen &&
              <div
                  className={`transform ${
                  mobileMenuOpen ? "w-full translate-x-0" : "-translate-x-full"
                  } fixed z-50 p-6 flex items-center justify-center w-full bg-white transition-all  md:hidden`}
              >
                  <nav aria-label="Global">
                      <ul className="flex flex-col items-center justify-center gap-8 text-sm">
                          {links.map((link) => (
                              <li key={link.link} className="text-base">
                                  <Link 
                                      style={{ color: linksMobileColour }} 
                                      href={link.link}
                                      className="font-title text-black"
                                  >
                                      {link.title}
                                  </Link>
                              </li>
                          ))}
                      </ul>
                  </nav> 
              </div>
          }
      </header>
    </div>
  );
}