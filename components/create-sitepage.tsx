import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CreateSitePageButton from "./create-sitepage-button";
import CreateSitePageModal from "./modal/create-sitepage";
import { PageType } from "@prisma/client";


export default async function CreateSitePage({pageTypes}: {pageTypes: PageType[]}){
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  
  return (
    <>
      <CreateSitePageButton>
        <CreateSitePageModal pageTypes={pageTypes}/>
      </CreateSitePageButton>
    </>
  )
};
