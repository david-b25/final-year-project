import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CreateSiteButton from "./create-site-button";
import CreateSiteModal from "./modal/create-site";


export default async function OverviewSitesCTA() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  
  return (
    <>
      <CreateSiteButton>
        <CreateSiteModal />
      </CreateSiteButton>
    </>
  )
};
