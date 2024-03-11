"use client";

import PageSwitcher from "@/editor/page-switcher";
import PreviewButton from "@/editor/preview-button";
import PublishSitePage from "@/editor/publish-sitepage-button";
import SaveSitePageContent from "@/editor/save-content-button";
import PublishSitePageContent from "@/editor/publish-content-button";
import Loading from "@/editor/loading";
import Link from "next/link";
import Image from "next/image";

import { Site, SitePage } from "@prisma/client";
import Designer from "@/editor/designer";

import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import DragOverlayWrapper from "@/editor/drag-overlay-wrapper";
import useDesigner from "@/editor/hooks/use-designer";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/editor/ui/tabs";
import { Monitor, Tablet, Smartphone, Globe, Rocket, ChevronsUpDown  } from "lucide-react";


import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/editor/ui/popover"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/editor/ui/command"

import { Button } from "@/editor/ui/button"      

type SitePageWithSite = SitePage & { site: { subdomain: string | null } | null };

export default function WebsiteEditor({ site, sitePage, sitePages, url }: { site: Site, sitePage: SitePageWithSite, sitePages: SitePage[], url: string }) {
    const { setElements, setSelectedElement } = useDesigner();
    const [isReady, setIsReady] = useState(false);
    const [displaySize, setDisplaySize] = React.useState<"large" | "medium" | "small">("large");
    const [open, setOpen] = React.useState(false);

    const handleClick = (size: "large" | "medium" | "small") => {
        setDisplaySize(size);
    };

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    //mobile
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 300,
            tolerance: 5,
        }
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    useEffect(() => {
        if (isReady) return;
        const navbar = JSON.parse(site.savedNavbar);
        const footer = JSON.parse(site.savedFooter);
        const pageElements = JSON.parse(sitePage.savedContent);
        const elements = [...navbar, ...pageElements, ...footer];
        setElements(elements);
        setSelectedElement(null);
        const readyTimeout = setTimeout(() => setIsReady(true), 500);
        return () => clearTimeout(readyTimeout);
    }, [sitePage, setElements, isReady, setSelectedElement]);

    if (!isReady) {
        return (
            <Loading />
        );
    }

    return (
        <DndContext sensors={sensors}>
            <main className="flex flex-col w-full">
                <nav className="flex w-full justify-between items-center bg-stone-100 border-b border-stone-300">
                    <div className="flex h-10 min-w-10 w-10 items-center bg-stone-200">
                        <Link href={`/app/site/${site.id}`} className="px-2 py-2 border-r border-stone-300 bg-stone-200 hover:bg-stone-300">
                            <Image src="/logo-circle.svg" width={24} height={24} alt="Logo" className="" />
                        </Link>
                    </div>
                    <div className="flex h-10 px-2 items-center w-[238px]">
                        <PageSwitcher siteId={sitePage?.siteId || ""} items={sitePages} />
                    </div>
                    <div className="w-full">
                        <a
                            href="/app"
                            target="_blank"
                            rel="noreferrer"
                            className="border border-border flex items-center justify-center truncate bg-white rounded-md px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
                        >
                            <Globe className="h-3" />
                            {url}
                            <span className="ml-1">↗</span>
                        </a>
                    </div>
                    <div className="hidden md:flex items-center pl-2">
                        <Tabs defaultValue={"large"}>
                            <TabsList className="border">
                                <TabsTrigger value="large" className="w-10 transition-all hover:bg-stone-50" onClick={() => handleClick("large")}>
                                    <Monitor className="h-4" />
                                </TabsTrigger>
                                <TabsTrigger value="medium" className="w-10 transition-all hover:bg-stone-50" onClick={() => handleClick("medium")}>
                                    <Tablet className="h-4" />
                                </TabsTrigger>
                                <TabsTrigger value="small" className="w-10 transition-all hover:bg-stone-50" onClick={() => handleClick("small")}>
                                    <Smartphone className="h-4" />
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="flex items-center px-2 md:space-x-2 rounded-lg">
                            <PreviewButton site={site}/>
                            <SaveSitePageContent site={site} sitePage={sitePage} />
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        role="combobox"
                                        aria-expanded={open}
                                        aria-label="Change Page"
                                        className="justify-between text-sm text-stone-600"
                                    >
                                        <div className="flex items-center truncate">
                                            <p className="truncate">Publish</p>
                                            <Rocket className="h-3" />
                                        </div>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[258px]  p-0">
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                <CommandItem>
                                                    {sitePage.published &&
                                                        <PublishSitePageContent sitePage={sitePage} />
                                                    }
                                                </CommandItem>
                                                <CommandItem>
                                                    <PublishSitePage sitePage={sitePage} />
                                                </CommandItem>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </nav>
                <div className="bg-stone-200 flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px]">
                    <Designer site={site} sitePage={sitePage} sitePages={sitePages} displaySize={displaySize} />
                </div>
            </main>
            <DragOverlayWrapper site={site} />
        </DndContext>
    )
}