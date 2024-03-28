"use server"

import { generate } from "@/lib/actions/generate/generate";

export const generateContactPage = async (description: string, about: string) => {

    const paragraphText = await generate("Ciaran Bohan is a Civil Engineer and Project Manager with over 17 years’ experience in the Building");
    const contactContent = JSON.stringify([{"id":"3760","type":"ContactOne","extraAttributes":{"image":"https://julftz3s2fuspgpn.public.blob.vercel-storage.com/z2l7UbNaOao4Ap7Eo3CJH-LaL5fxn6UPGE5ywRnSKgqC5lSeCxKv.png","backgroundColour":"#ffe59b","tagline":{"text":"HAVE A QUESTION?","textColour":"#0d343d"},"title":{"text":"Contact Us","textColour":"#0d343d"},"paragraph":{"text":"If you would like to arrange a consultation, get a quotation or ask us a question then get in touch - our team is always willing to discuss and advise on upcoming projects.","textColour":"#0d343d"},"linkTitles":{"textOne":"EMAIL","textColourOne":"#0d343d","textTwo":"ADDRESS","textColourTwo":"#0d343d","textThree":"PHONE","textColourThree":"#0d343d"},"links":{"textOne":"ciaranb17@yahoo.com","textColourOne":"#0d343d","textTwo":"0873883357","textColourTwo":"#0d343d","textThree":"Galway, Ireland","textColourThree":"#0d343d"}}}]);

    return contactContent;
}
