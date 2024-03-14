"use client";

import { createContext } from "react";
import { PageElementInstance } from "@/editor/page-elements";
import { useState, Dispatch, SetStateAction } from "react";

type DesignerContextType = {
    elements: PageElementInstance[];
    setElements: Dispatch<SetStateAction<PageElementInstance[]>>;
    addElement: (index: number, element: PageElementInstance) => void;
    removeElement: (id: string) => void;

    selectedElement: PageElementInstance | null;
    setSelectedElement: Dispatch<SetStateAction<PageElementInstance | null>>;

    updateElement: (id: string, element: PageElementInstance) => void;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({ 
    children,
 }: { children: React.ReactNode;
}) {
    const [elements, setElements] = useState<PageElementInstance[]>([]);
    const [selectedElement, setSelectedElement] = useState<PageElementInstance | null>(null);
    
    const addElement = (index: number, element: PageElementInstance) => {
        setElements((prev) => {
            const newElements = [...prev];
            newElements.splice(index, 0, element);
            return newElements;
        });
    };

    const removeElement = (id: string) => {
        setElements((prev) => prev.filter((element) => element.id !== id)); 
        setSelectedElement(null);
    };

    const updateElement = (id: string, element: PageElementInstance) => {
        setElements(prev => {
            const newElements = [...prev];
            const index = newElements.findIndex(el => el.id === id)
            newElements[index] = element;
            return newElements;
        })
    };

    return (
        <DesignerContext.Provider 
        value={{
            elements,
            setElements,
            addElement,
            removeElement,

            selectedElement,
            setSelectedElement,

            updateElement,
        }}>
            {children}
        </DesignerContext.Provider>
    );
}