import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/editor/ui/form";
import { Input } from "@/editor/ui/input";
import { SitePage } from '@prisma/client';


export function ButtonElement({control, text, textColour, link, backgroundColour, sitePages}: {control: any, text: string, textColour: string, link: string, backgroundColour: string, sitePages: SitePage[]}) {
  return (
        <div className="w-full">
            <div>
                    <>
                        <FormField
                            control={control}
                            name={text}
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

                        <div className="flex items-start justify-between mt-1">
                            <FormField
                            control={control}
                            name={textColour}
                            render={({ field }) => (
                                <FormItem className="w-full"> 
                                <FormControl>
                                    <Input {...field} 
                                        className="mt-0 w-full rounded-r-none rounded-l-lg"
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
                            <FormField
                                control={control}
                                name={textColour}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                            type="color"
                                            className="w-[75px] rounded-l-none rounded-r-lg border-t border-b border-r hover:cursor-pointer"
                                            style={{ backgroundColor: field.value }}
                                            {...field}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") e.currentTarget.blur();
                                            }}
                                            >
                                            </Input>
                                        </FormControl>
                                    </FormItem>
                                )}
                            /> 
                        </div>
                        <div className="mt-1">
                            <div className="flex items-start justify-between">
                                <FormField
                                    control={control}
                                    name={link}
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
                                    name={link}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <select
                                                    name="link"
                                                    defaultValue="Pages"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        field.value = e.target.value; 
                                                    }}
                                                    className="w-[75px] flex border-stone-300 text-xs text-stone-600 truncate h-9 rounded-l-none rounded-r-lg border-t border-b border-r px-3 py-2 ring-offset-background placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
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
                        </div>
                        <div className="flex items-start justify-between mt-1">
                            <FormField
                            control={control}
                            name={backgroundColour}
                            render={({ field }) => (
                                <FormItem className="w-full"> 
                                <FormControl>
                                    <Input {...field} 
                                        className="mt-0 w-full rounded-r-none rounded-l-lg"
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
                            <FormField
                                control={control}
                                name={backgroundColour}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                            type="color"
                                            className="w-[75px] rounded-l-none rounded-r-lg border-t border-b border-r hover:cursor-pointer"
                                            style={{ backgroundColor: field.value }}
                                            {...field}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") e.currentTarget.blur();
                                            }}
                                            >
                                            </Input>
                                        </FormControl>
                                    </FormItem>
                                )}
                            /> 
                        </div>
                    </>
            </div>
    </div>
  );
};