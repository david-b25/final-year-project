import React from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { SitePage } from '@prisma/client';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/editor/ui/form";
import { Input } from "@/editor/ui/input";
import { Button } from "@/editor/ui/button";
import { Separator } from "@/editor/ui/separator";

import { Link as LinkIcon } from "lucide-react"
import { idGenerator } from '@/lib/utils';

export function Links({control, name, sitePages}: {control: any, name: string, sitePages: SitePage[]}) {
    

    const { fields, append, remove} = useFieldArray({
        name: name,
        control: control,
    });

  return (
    <div className="w-full">
        {fields.map((field, index) => (
            <>
                <div className="w-full flex items-start justify-between">
                    <FormField
                    control={control}
                    key={field.id}
                    name={`${name}.${index}.title`}
                    render={({ field }) => (
                        <FormItem className="w-full"> 
                        <FormControl>
                            <Input {...field} 
                                className="mt-0 w-full rounded-lg"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") e.currentTarget.blur();
                                }}
                            >
                            </Input>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="mt-1">
                    <div className="flex items-start justify-between">
                        <FormField
                            control={control}
                            key={field.id}
                            name={`${name}.${index}.link`}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input
                                            className="mt-0 w-full rounded-r-none rounded-l-lg"
                                            {...field}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") e.currentTarget.blur();
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> 
                        <FormField
                            control={control}
                            key={field.id}
                            name={`${name}.${index}.link`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <select
                                            name="links"
                                            defaultValue="Pages"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                field.value = e.target.value; 
                                            }}
                                            className="w-[75px] flex border-stone-300 text-xs text-stone-600 truncate h-9 rounded-l-none rounded-r-lg px-3 py-2 ring-offset-background placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option selected disabled>Pages</option>
                                            {sitePages.map((page) => (
                                                <option key={page.id} value={page.slug}>
                                                    <p className="truncate">{page.slug}</p>
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                </FormItem>
                            )}
                        /> 
                    </div>
                    <div className="flex w-full items-center justify-end">
                        <Button 
                                type="button"
                                size="sm"
                                className="text-stone-400 font-normal underline pr-1 mt-0.5 text-xs"
                                onClick={() => remove(index)} 
                            >
                                Remove Link
                        </Button>
                    </div>
                </div>
                <Separator />
            </>
        ))}
        <Button
            type="button"
            variant={"outline"}
            size={"sm"}
            className="rounded-lg bg-black px-2 py-1 mt-2 mb-4 text-xs text-white hover:bg-white hover:text-black"
            onClick={() => append({ title: "New Link", link: "/home", key: idGenerator() })}
        >
            Add Navbar Link
            <LinkIcon className="h-3" />
        </Button>
    </div>
  )
}