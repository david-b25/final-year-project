import { HeroOnePageElement } from "./page-elements/hero-one";
import { NavbarOnePageElement } from "./page-elements/navbar-one";
import { ActionOnePageElement } from "./page-elements/action-one";
import { FooterOnePageElement } from "./page-elements/footer-one";
import { CollectionOnePageElement } from "./page-elements/collection-one";
import { ContentOnePageElement } from "./page-elements/content-one";
import { ContactOnePageElement } from "./page-elements/contact-one";
import { HeaderOnePageElement } from "./page-elements/header-one";
import { HeaderTwoPageElement } from "./page-elements/header-two";
import { TextOnePageElement } from "./page-elements/text-one";
import { TextTwoPageElement } from "./page-elements/text-two";

import { Site, SitePage } from "@prisma/client";

export type ElementsType =
  | "HeroOne"
  | "NavbarOne"
  | "ActionOne"
  | "FooterOne"
  | "ContactOne"
  | "CollectionOne"
  | "HeaderOne"
  | "HeaderTwo"
  | "TextOne"
  | "TextTwo"
  | "ContentOne";

export type PageElement = {
  type: ElementsType;

  construct: (id: string) => PageElementInstance;

  designerButtonElement: {
    image: string,
    label: string
  }

  designerComponent: React.FC<{
    site: Site;
    elementInstance: PageElementInstance;
  }>;
  pageComponent: React.FC<{
    site: Site;
    elementInstance: PageElementInstance;
  }>;
  propertiesComponent: React.FC<{
    sitePages: SitePage[];
    elementInstance: PageElementInstance;
  }>;
};

export type PageElementInstance = {
  id: string;
  type: ElementsType;
  extraAttributes?: Record<string, any>;
}

type PageElementsType = {
  [key in ElementsType]: PageElement;
}

export const PageElements: PageElementsType = {
  HeroOne: HeroOnePageElement,
  NavbarOne: NavbarOnePageElement,
  ContentOne: ContentOnePageElement,
  ActionOne: ActionOnePageElement,
  FooterOne: FooterOnePageElement,
  CollectionOne: CollectionOnePageElement,
  ContactOne: ContactOnePageElement,
  HeaderOne: HeaderOnePageElement,
  HeaderTwo: HeaderTwoPageElement,
  TextOne: TextOnePageElement,
  TextTwo: TextTwoPageElement,
}
