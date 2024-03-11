//"use client";
import React from 'react'
import { Site } from '@prisma/client';
import { PageElementInstance, PageElements } from '@/editor/page-elements';

function RenderPage({ content, site }: { content: PageElementInstance[], site: Site }) {
  return (
    <>
      {content.map((element) => {
        const PageElement = PageElements[element.type].pageComponent;
        return (<PageElement key={element.id} elementInstance={element} site={site}/>);
      })}
    </>
  )
}

export default RenderPage;