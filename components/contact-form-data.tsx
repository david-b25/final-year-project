
import prisma from "@/lib/prisma";
import { Site, ContactForm } from "@prisma/client";
import { columns } from "./columns"
import { DataTable } from "./data-table"

export default async function RenderContactFormData({
  site,
  contactForm,
}: {
  site: Site;
  contactForm: ContactForm;
}) {

  const formSubmissions = await prisma.formSubmission.findMany({
    where: {
      contactFormId: contactForm.id,
    },
  })

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={formSubmissions} />
    </div>
  )
}