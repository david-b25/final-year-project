import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/editor/ui/form";
import { Input } from "@/editor/ui/input";

export function TextAndColour({label, control, text, textColour}: {label: string, control: any, text: string, textColour: string}) {
  return (
    <div className="w-full">
        <FormLabel className="text-xs text-stone-600">{label}</FormLabel>
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
    </div>
  )
}