"use client";
import { z } from "zod";
import { SitePage } from "@prisma/client"
import { PageElementInstance } from "@/editor/page-elements";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import useDesigner from "@/editor/hooks/use-designer";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/editor/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/editor/ui/accordion"

import Uploader from "@/editor/page-elements/uploader";
import { Colour } from "@/editor/page-elements/update-fields/colour";
import { TextAndColour } from "@/editor/page-elements/update-fields/text-and-colour";
import { TextareaAndColour } from "@/editor/page-elements/update-fields/textarea-and-colour";
import { ButtonElement } from "@/editor/page-elements/update-fields/button";
import { Links } from "@/editor/page-elements/update-fields/links";
import { DeleteButton } from "@/editor/page-elements/update-fields/delete";


type CustomInstance = PageElementInstance & {
    extraAttributes: typeof extraAttributes;
}

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

const propertiesSchema = z.object({
    backgroundColour: z.string().min(7).max(7),

    description: z.object({
        text: z.string().min(2).max(250),
        textColour: z.string().min(7).max(7),
    }).optional(),

    linksTitles: z.object({
        textOne: z.string().min(2).max(50),
        textColourOne: z.string().min(7).max(7),

        textTwo: z.string().min(2).max(50),
        textColourTwo: z.string().min(7).max(7),
    }).optional(),

    linksColour: z.string().min(7).max(7),

    linksOne: z
    .array(
      z.object({
        title: z.string().min(2).max(50),
        link: z.string().min(1).max(50),
        key: z.string().min(1).max(50),
      })
    )
    .optional(),

    linksTwo: z
    .array(
      z.object({
        title: z.string().min(2).max(50),
        link: z.string().min(1).max(50),
        key: z.string().min(1).max(50),
      })
    )
    .optional(),

    copyright: z.object({
        text: z.string().min(2).max(50),
        textColour: z.string().min(7).max(7),
    }).optional(),

    linksThree: z
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
            description: element.extraAttributes.description,
            linksTitles: element.extraAttributes.linksTitles,
            linksColour: element.extraAttributes.linksColour,
            linksOne: element.extraAttributes.linksOne,
            linksTwo: element.extraAttributes.linksTwo,
            copyright: element.extraAttributes.copyRight,
            linksThree: element.extraAttributes.linksThree,
        }
    });
    
    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form]);

    function applyChanges(values: propertiesFormSchemaType){
        const { backgroundColour, description, linksTitles, linksColour,  linksOne, linksTwo, copyright, linksThree  } = values;
        updateElement(element.id, {
            ...element,
            extraAttributes:{
                backgroundColour,
                description,
                linksTitles,
                linksColour,
                linksOne,
                linksTwo,
                copyright,
                linksThree,
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

                    <AccordionItem value="description">
                    <AccordionTrigger>Description</AccordionTrigger>
                    <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                        <TextareaAndColour 
                            label="Description"
                            control={form.control}
                            text="description.text"
                            textColour="description.textColour"
                        />
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="linksTitles">
                    <AccordionTrigger>Links Titles</AccordionTrigger>
                    <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                        <TextAndColour 
                            label="Pages Title"
                            control={form.control}
                            text="linksTitles.textOne"
                            textColour="linksTitles.textColourOne"
                        />

                        <TextAndColour 
                            label="Contact Title"
                            control={form.control}
                            text="linksTitles.textTwo"
                            textColour="linksTitles.textColourTwo"
                        />
                    </AccordionContent>
                    </AccordionItem>


                    <AccordionItem value="linksOne">
                    <AccordionTrigger>Page Links</AccordionTrigger>
                    <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                        <Links 
                            control={form.control}
                            name="linksOne"
                            sitePages={sitePages}
                        />
                        
                        <Colour 
                            label="Link Colour"
                            control={form.control}
                            name="linksColour"
                            description="This is the main background colour for the navbar section of the page."
                        />
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="linksTwo">
                    <AccordionTrigger>Contact Links</AccordionTrigger>
                    <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                        <Links 
                            control={form.control}
                            name="linksTwo"
                            sitePages={sitePages}
                        />
                        
                        <Colour 
                            label="Link Colour"
                            control={form.control}
                            name="linksColour"
                            description="This is the main background colour for the navbar section of the page."
                        />
                    </AccordionContent>
                    </AccordionItem>


                    <AccordionItem value="bottom">
                    <AccordionTrigger>Bottom</AccordionTrigger>
                    <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                        <TextAndColour 
                            label="Copyright"
                            control={form.control}
                            text="copyright.text"
                            textColour="copyright.textColour"
                        />

                        <Links 
                            control={form.control}
                            name="linksThree"
                            sitePages={sitePages}
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
