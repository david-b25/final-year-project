"use client";

import * as React from "react";
import { SitePage } from "@prisma/client";
import { useParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import CreateSitePageButton from "./create-sitepage-button";
import CreateSitePageModal from "@/editor/modal/create-sitepage";
import { notFound } from "next/navigation";
import {  ChevronsUpDown, ChevronRight, File } from "lucide-react"

import { Button } from "@/editor/ui/button"

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

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface PageSwitcherProps extends PopoverTriggerProps{
    items: SitePage[];
    siteId: string;
}

export default function PageSwitcher({ className, items = [], siteId }: PageSwitcherProps){
    const params = useParams();
    const router = useRouter();

    if (!siteId) {
        return notFound();
    }

    const formattedItems = items.map((item) => ({
        ...item,
        label: item.title || '',
        value: item.id,
    }));

    const currentSitePage = formattedItems.find((item) => item.value === params.id);

    const [open, setOpen] = React.useState(false);

    const onSitePageSelect = (sitePage: {value: string, label: string}) => {
        setOpen(false);
        router.push(`/app/sitepage/${sitePage.value}`);
    }

    return ( 
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Change Page"
                    className={cn("w-[100px] md:w-[238px] max-w-[238px] justify-between text-sm text-stone-600", className)}
                >
                    <div className="flex items-center truncate">
                        <File className="h-3"/>
                        <p className="truncate">{currentSitePage?.label}</p>
                    </div>
                    <div>
                        <ChevronsUpDown className="h-3"/>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[258px]  p-0">
                <Command>
                <CommandList>
                    <CommandInput placeholder="Search page..." />
                    <CommandEmpty>No page found.</CommandEmpty>
                    <CommandGroup className="text-sm py-1" heading="Main Pages">
                        {formattedItems.map((sitePage) => (
                            <CommandItem
                                key={sitePage.value}
                                onSelect={() => onSitePageSelect(sitePage)}
                                className={`w-[238px] flex justify-between text-sm text-stone-600 rounded-lg ${cn(
                                    currentSitePage?.value === sitePage.value
                                        ? "bg-stone-100"
                                        : "bg-white"
                                )}`}
                            >

                            <div className="flex items-center truncate">
                                <p className="truncate">{sitePage.label}</p>
                            </div>
                            <div>
                                <ChevronRight className="ml-2 h-3 w-3" />
                            </div>
                            
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
                <CommandSeparator />
                <CommandList>
                    <CommandGroup>
                        <CommandItem className="px-0" onSelect={() => {setOpen(false)}}>
                            <CreateSitePageButton>
                                <CreateSitePageModal id={siteId}/>
                            </CreateSitePageButton>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
};