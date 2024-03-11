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
import { ButtonElement } from "@/editor/page-elements/update-fields/button";
import { DeleteButton } from "@/editor/page-elements/update-fields/delete";


type CustomInstance = PageElementInstance & {
    extraAttributes: typeof extraAttributes;
}

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
const propertiesSchema = z.object({
    image: z.string().min(1).max(1000),

    backgroundColour: z.string().min(7).max(7),
    
    title: z.object({
        text: z.string().min(2).max(50),
        textColour: z.string().min(7).max(7),
    }).optional(),

    button: z.object({
        text: z.string().min(2).max(50),
        textColour: z.string().min(7).max(7),
        link: z.string().min(1).max(50),
        backgroundColour: z.string().min(7).max(7),
    }).optional(),
    
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
            image: element.extraAttributes.image,
            backgroundColour: element.extraAttributes.backgroundColour,
            title: element.extraAttributes.title,
            button: element.extraAttributes.button,
        }
    });
    
    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form]);

    function applyChanges(values: propertiesFormSchemaType){
        const { image, backgroundColour, title, button } = values;
        updateElement(element.id, {
            ...element,
            extraAttributes:{
                image,
                backgroundColour,
                title,
                button,
            }
        })
    }

    return (
        <div>
            <Accordion type="single" collapsible className="w-full pb-4  text-stone-600 text-xs">
                <AccordionItem value="image">
                <AccordionTrigger>Main Image</AccordionTrigger>
                <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                    <div className="w-full">
                        <Uploader 
                            fieldName="Background Image" 
                            onUploadSuccess={(url) => {
                                form.setValue('image', url);
                                form.handleSubmit(applyChanges)();
                            }} 
                        />
                    </div>
                </AccordionContent>
                </AccordionItem>

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
                                label = "Background Colour"
                                control={form.control}
                                name="backgroundColour"
                                description="This is the main background colour for the navbar section of the page."
                            />
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="textFields">
                    <AccordionTrigger>Text Fields</AccordionTrigger>
                    <AccordionContent className="px-2 grid grid-cols-1 md:grid-cols-1 gap-2 place-items-center">
                        
                        <TextAndColour 
                            label="Title"
                            control={form.control}
                            text="title.text"
                            textColour="title.textColour"
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
