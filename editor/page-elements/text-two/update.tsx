"use client";
import { z } from "zod";
import { SitePage } from "@prisma/client"
import { PageElementInstance } from "@/editor/page-elements";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import useDesigner from "@/editor/hooks/use-designer";
import { zodResolver } from "@hookform/resolvers/zod";

import { Trash2 } from "lucide-react";

import { Button } from "@/editor/ui/button";
import { Input } from "@/editor/ui/input";
import { Textarea } from "@/editor/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/editor/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/editor/ui/accordion"

import Uploader from "@/editor/page-elements/uploader";
import { Colour } from "@/editor/page-elements/update-fields/colour";
import { TextAndColour } from "@/editor/page-elements/update-fields/text-and-colour";
import { TextareaAndColour } from "@/editor/page-elements/update-fields/textarea-and-colour";
import { Links } from "@/editor/page-elements/update-fields/links";
import { ButtonElement } from "@/editor/page-elements/update-fields/button";
import { DeleteButton } from "@/editor/page-elements/update-fields/delete";

type CustomInstance = PageElementInstance & {
    extraAttributes: typeof extraAttributes;
}

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

const propertiesSchema = z.object({

    backgroundColour: z.string().min(7).max(7),
    
    longText: z.object({
        text: z.string().min(2).max(2000),
        textColour: z.string().min(7).max(7),
    }).optional(),

    linksTitle: z.object({
        text: z.string().min(2).max(50),
        textColour: z.string().min(7).max(7),
    }).optional(),

    linksBackgroundColour: z.string().min(7).max(7),

    linksColour: z.string().min(7).max(7),

    links: z
    .array(
      z.object({
        title: z.string().min(2).max(50),
        link: z.string().min(1).max(50),
        key: z.string().min(1).max(50),
      })
    )
    .optional(),
    
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
export function Update({
    sitePages,
    elementInstance
}: {
    sitePages: SitePage[],
    elementInstance: PageElementInstance;
}){
    const element = elementInstance as CustomInstance;
    const { updateElement, removeElement } = useDesigner();
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            backgroundColour: element.extraAttributes.backgroundColour,
            longText: element.extraAttributes.longText,
            linksTitle: element.extraAttributes.linksTitle,
            linksBackgroundColour: element.extraAttributes.linksBackgroundColour,
            linksColour: element.extraAttributes.linksColour,
            links: element.extraAttributes.links,
        }
    });
    
    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form]);

    function applyChanges(values: propertiesFormSchemaType){
        const { backgroundColour, longText, linksTitle, linksBackgroundColour, linksColour, links } = values;
        updateElement(element.id, {
            ...element,
            extraAttributes:{
                backgroundColour,
                longText,
                linksTitle,
                linksBackgroundColour,
                linksColour,
                links,
            }
        })
    }

    return (
        <div>
            <Accordion type="single" collapsible className="w-full pb-4  text-stone-600 text-xs">
                <Form {...form}>
                    <form
                        onBlur={form.handleSubmit(applyChanges)}
                        onSubmit={(e) => {
                        e.preventDefault();
                        }}
                    >
                    <AccordionItem value="background-test">
                    <AccordionTrigger>Background Colour</AccordionTrigger>
                    <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                            <Colour 
                                label="Background Colour"
                                control={form.control}
                                name="backgroundColour"
                                description="This is the main background colour for the navbar section of the page."
                            />
                    </AccordionContent>
                    </AccordionItem>

                    
                    <AccordionItem value="textFields">
                    <AccordionTrigger>Long Text</AccordionTrigger>
                    <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                        <TextareaAndColour 
                            label="Long Text"
                            control={form.control}
                            text="longText.text"
                            textColour="longText.textColour"
                        />
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="linksTitle">
                    <AccordionTrigger>Links Title</AccordionTrigger>
                    <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                        <TextAndColour 
                            label="Title"
                            control={form.control}
                            text="linksTitle.text"
                            textColour="linksTitle.textColour"
                        />
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="linksTwo">
                    <AccordionTrigger>Contact Links</AccordionTrigger>
                    <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                        <Colour 
                            label="Contact Background Colour"
                            control={form.control}
                            name="linksBackgroundColour"
                            description="This is the background colour for the links section of the page."
                        />

                        <Links 
                            control={form.control}
                            name="links"
                            sitePages={sitePages}
                        />
                        
                        <Colour 
                            label="Links Colour"
                            control={form.control}
                            name="linksColour"
                            description="This is the main background colour for the navbar section of the page."
                        />
                    </AccordionContent>
                    </AccordionItem>
            </form>
        </Form>
        </Accordion>

        <DeleteButton element={element.id}/>
    </div>
);
}