import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CreateContactFormButton from "./create-contact-button";
import CreateContactFormModal from "./modal/create-contact-form";
import { PageType } from "@prisma/client";


export default async function CreateContactForm(){
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  
  return (
    <>
      <CreateContactFormButton>
        <CreateContactFormModal />
      </CreateContactFormButton>
    </>
  )
};
