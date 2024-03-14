"use client";

import { UserButton } from "@clerk/nextjs";
import { Settings, Paintbrush, PanelsTopLeft, UserSearch, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { PageElements } from "./page-elements";
import useDesigner from "@/editor/hooks/use-designer";

import { updateSitePageMetadata } from "@/lib/actions/sitepage"
import DeleteSitePage from "@/components/form/delete-sitepage";
import Form from "@/components/form";
import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/editor/ui/accordion"

import SidebarButtonElement from "@/editor/sidebar-button-element";
import SetHomePage from "@/editor/set-homepage";

import { SitePage } from "@prisma/client"

type SidebarName = 'SidebarOne' | 'SidebarTwo' | 'SidebarThree' | 'SidebarFour' | null;

export default function NavbarLeft({sitePage}: {sitePage: SitePage}) {
  const [activeSidebar, setActiveSidebar] = useState<SidebarName>('SidebarOne');
  const { selectedElement } = useDesigner();

  const toggleSidebar = (sidebarName: SidebarName) => {
    if (activeSidebar === sidebarName) {
      setActiveSidebar(null); // Hide the sidebar if it's already active
    } else if (activeSidebar === sidebarName && selectedElement){
      setActiveSidebar(null);
    } else {
      setActiveSidebar(sidebarName); // Show the selected sidebar
    }
  };

  return (
    <div className="flex flex-row">
      <nav className="hidden md:flex h-full w-10 flex-col inset-y-0 z-50">
        <div className="h-full border-r border-stone-300 flex flex-col justify-between overflow-y-auto bg-stone-200 shadow-sm">
          <div>
            <div className="flex flex-col">
              <button onClick={() => toggleSidebar('SidebarOne')} className={cn("flex h-10 items-center justify-center border-b border-stone-300 bg-stone-200 hover:bg-stone-300", {
                'bg-stone-300': activeSidebar === 'SidebarOne',
              })}>
                <PanelsTopLeft className="h-4" />
              </button>
              <button onClick={() => toggleSidebar('SidebarTwo')} className={cn("flex h-10 items-center justify-center border-b border-stone-300 bg-stone-200 hover:bg-stone-300", {
                'bg-stone-300': activeSidebar === 'SidebarTwo',
              })}>
                <UserSearch className="h-4" />
              </button>
              <button onClick={() => toggleSidebar('SidebarThree')} className={cn("flex h-10 items-center justify-center border-b border-stone-300 bg-stone-200 hover:bg-stone-300", {
                'bg-stone-300': activeSidebar === 'SidebarThree',
              })}>
                <Paintbrush className="h-4" />
              </button>
              <button onClick={() => toggleSidebar('SidebarFour')}className={cn("flex h-10 items-center justify-center border-b border-stone-300 bg-stone-200 hover:bg-stone-300", {
                'bg-stone-300': activeSidebar === 'SidebarFour',
              })}>
                <Settings className="h-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-col border-t border-stone-300-border">
            <div className="flex h-10 items-center justify-center border-b border-stone-300-border bg-stone-200 hover:bg-stone-300">
              <UserButton />
            </div>
          </div>
        </div>
      </nav>
      {!selectedElement ? 
        <div className="hidden md:flex relative z-50 h-full">
          {activeSidebar === 'SidebarOne' && (
            <aside className="w-[250px] max-w-[250px] flex flex-col flex-grow overflow-y-auto h-full bg-white border-r border-stone-300">
              <div className="flex items-center justify-between text-sm text-stone-600 font-medium h-10 min-h-10 px-2 text-left border-b border-stone-300 bg-stone-100 ">
                Add Components
                <button onClick={() => {
                      toggleSidebar(null);
                  }}>
                    <div className="flex items-center text-xs text-stone-400">
                      <p>Close</p>
                    </div>
                </button>
              </div>
              <Accordion type="single" collapsible className="w-full text-stone-600 text-xs">
                <AccordionItem value="navigation">
                  <AccordionTrigger>Navigation</AccordionTrigger>
                  <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                    <SidebarButtonElement pageElement={PageElements.NavbarOne} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="hero">
                  <AccordionTrigger>Hero</AccordionTrigger>
                  <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                    <SidebarButtonElement pageElement={PageElements.HeroOne} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="headers">
                  <AccordionTrigger>Headers</AccordionTrigger>
                  <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                    <SidebarButtonElement pageElement={PageElements.HeaderOne} />
                    <SidebarButtonElement pageElement={PageElements.HeaderTwo} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="content">
                  <AccordionTrigger>Content</AccordionTrigger>
                  <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                    <SidebarButtonElement pageElement={PageElements.ContentOne} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="longText">
                  <AccordionTrigger>Long Text</AccordionTrigger>
                  <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                    <SidebarButtonElement pageElement={PageElements.TextOne} />
                    <SidebarButtonElement pageElement={PageElements.TextTwo} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="collection">
                  <AccordionTrigger>Collection</AccordionTrigger>
                  <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                    <SidebarButtonElement pageElement={PageElements.CollectionOne} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="callToAction">
                  <AccordionTrigger>Call To Action</AccordionTrigger>
                  <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                    <SidebarButtonElement pageElement={PageElements.ActionOne} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="contact">
                  <AccordionTrigger>Contact</AccordionTrigger>
                  <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                    <SidebarButtonElement pageElement={PageElements.ContactOne} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="footer">
                  <AccordionTrigger>Footer</AccordionTrigger>
                  <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                    <SidebarButtonElement pageElement={PageElements.FooterOne} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </aside>
          )}
          {activeSidebar === 'SidebarTwo' && (
            <aside className="w-[500px] max-w-[500px] flex flex-col flex-grow overflow-y-auto h-full bg-white border-r border-stone-300">
              <div className="flex items-center justify-between text-sm text-stone-600 font-medium h-10 min-h-10 px-2 text-left border-b border-stone-300 bg-stone-100 ">
                SEO Settings
                <button onClick={() => {
                      toggleSidebar(null);
                  }}>
                    <div className="flex items-center text-xs text-stone-400">
                      <p>Close</p>
                    </div>
                </button>
              </div>
              <div className="p-2 space-y-2">
                <Form
                  title="SitePage Slug"
                  description="The slug is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."
                  helpText="Please use a slug that is unique to this post."
                  inputAttrs={{
                    name: "slug",
                    type: "text",
                    defaultValue: sitePage?.slug!,
                    placeholder: "slug",
                  }}
                  handleSubmit={updateSitePageMetadata}
                />

                <Form
                  title="Thumbnail image"
                  description="The thumbnail image for your post. Accepted formats: .png, .jpg, .jpeg"
                  helpText="Max file size 50MB. Recommended size 1200x630."
                  inputAttrs={{
                    name: "image",
                    type: "file",
                    defaultValue: sitePage?.image!,
                  }}
                  handleSubmit={updateSitePageMetadata}
                />
            </div>
          </aside>
          )}
          {activeSidebar === 'SidebarThree' && (
            <aside className="w-[250px] max-w-[250px] flex flex-col flex-grow overflow-y-auto h-full bg-white border-r border-stone-300">
              <div className="flex items-center justify-between text-sm text-stone-600 font-medium h-10 min-h-10 px-2 text-left border-b border-stone-300 bg-stone-100 ">
                Global Styles
                <button onClick={() => {
                      toggleSidebar(null);
                  }}>
                    <div className="flex items-center text-xs text-stone-400">
                      <p>Close</p>
                    </div>
                </button>
              </div>
          </aside>
          )}
          {activeSidebar === 'SidebarFour' && (
            <aside className="w-[500px] max-w-[500px] flex flex-col flex-grow overflow-y-auto h-full bg-white border-r border-stone-300">
              <div className="flex items-center justify-between text-sm text-stone-600 font-medium h-10 min-h-10 px-2 text-left border-b border-stone-300 bg-stone-100 ">
                Settings
                <button onClick={() => {
                      toggleSidebar(null);
                  }}>
                    <div className="flex items-center text-xs text-stone-400">
                      <p>Close</p>
                    </div>
                </button>
              </div>
              <div className="p-2 space-y-2">
                
                <DeleteSitePage sitePageName={sitePage?.title!} />
            </div>
          </aside>
          )}
        </div>
      : null}
    </div>
  );
}