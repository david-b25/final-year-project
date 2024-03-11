import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/editor/ui/form";
import { Input } from "@/editor/ui/input";

export function Colour({label, control, name, description}: {label: string, control: any, name: string, description: string}) {
  return (
    <div>
        <FormLabel className="text-xs text-stone-600">{label}</FormLabel>
        <div className="flex items-start justify-between">
            <FormField
            control={control}
            name={name}
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
                name={name}
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
        <FormDescription className="text-xs text-stone-500 my-2 mx-1">
                {description}
        </FormDescription>
</div>
  );
}