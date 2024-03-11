"use client";
import { z } from "zod";
import { SitePage } from "@prisma/client"
import { PageElementInstance } from "@/editor/page-elements";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

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

const propertiesSchema = z.object({
    backgroundColour: z.string().min(7).max(7),

    button: z.object({
        text: z.string().min(2).max(50),
        textColour: z.string().min(7).max(7),
        link: z.string().min(1).max(50),
        backgroundColour: z.string().min(7).max(7),
    }).optional(),
    
    linksColour: z.string().min(7).max(7),
    linksMobileColour: z.string().min(7).max(7),

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
            button: element.extraAttributes.button,
            linksColour: element.extraAttributes.linksColour,
            linksMobileColour: element.extraAttributes.linksMobileColour,
            links:  element.extraAttributes.links,
        }
    });
    
    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form]);

    function applyChanges(values: propertiesFormSchemaType){
        const { backgroundColour, button, linksColour, linksMobileColour, links } = values;
        updateElement(element.id, {
            ...element,
            extraAttributes:{
                backgroundColour,
                button,
                linksColour,
                linksMobileColour,
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
                                label= "Background Colour"
                                control={form.control}
                                name="backgroundColour"
                                description="This is the main background colour for the navbar section of the page."
                            />
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="links">
                    <AccordionTrigger>Links</AccordionTrigger>
                    <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                        <Links 
                            control={form.control}
                            name="links"
                            sitePages={sitePages}
                        />
                        
                        <Colour 
                            label="Link Colour - Desktop"
                            control={form.control}
                            name="linksColour"
                            description="This is the main background colour for the navbar section of the page."
                        />
                        <Colour 
                            label="Link Colour - Mobile"
                            control={form.control}
                            name="linksMobileColour"
                            description="This is the main background colour for the navbar section of the page."
                        />
                        
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="button">
                    <AccordionTrigger>Button</AccordionTrigger>
                    <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                        <ButtonElement 
                            control={form.control}
                            text="button.text"
                            textColour="button.textColour"
                            link="button.link"
                            backgroundColour="button.backgroundColour"
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
