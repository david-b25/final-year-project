import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import RenderContactFormData from "@/components/contact-form-data";
import Image from "next/image";

export default async function SiteOverview({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const data = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
  });

  if (!data || data.userId !== userId) {
    notFound();
  }

  const contactForm = await prisma.contactForm.findUnique({
    where: {
      siteId: data.id,
      userId: userId,
    },
    include: {
      site: true
    }
  });


  return contactForm ? (
    <RenderContactFormData site={data} contactForm={contactForm}/>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="mt-10 font-cal text-4xl mb-10">No Form Added</h1>
      <Image
        alt="missing post"
        src="/no-pages.jpg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You have not created a form yet. Create one to get started.
      </p>
    </div>
  );
}