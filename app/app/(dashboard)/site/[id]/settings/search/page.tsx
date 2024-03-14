import prisma from "@/lib/prisma";
import Form from "@/components/form";
import { updateSiteMetaData } from "@/lib/metadata";

export default async function SiteSettingsIndex({
  params,
}: {
  params: { id: string };
}) {
  const data = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
  });

  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="Title Tag"
        description="Enter a concise and descriptive title for your website. This title will appear in search engine results and is crucial for SEO and user experience."
        helpText="Optimal length is between 50-60 characters."
        inputAttrs={{
          name: "titleTag",
          type: "text",
          defaultValue: data?.titleTag!,
          placeholder: "My Awesome Site",
          maxLength: 100,
        }}
        handleSubmit={updateSiteMetaData}
      />
      <Form
        title="Meta Description"
        description="Provide a brief summary of your website's content. This description is used by search engines to understand the context of your site and is displayed in search results."
        helpText="Optimal length is between 155-300 characters."
        inputAttrs={{
          name: "metaDescription",
          type: "text",
          defaultValue: data?.metaDescription!,
          placeholder: "A blog about really interesting things.",
          maxLength: 100,
        }}
        handleSubmit={updateSiteMetaData}
      />
      <Form
        title="Favicon"
        description="Upload a favicon for your website. This small icon will represent your website in browser tabs, bookmark lists, and within the search results."
        helpText="Optimal size is 32x32 pixels."
        inputAttrs={{
          name: "favicon",
          type: "file",
          defaultValue: data?.favicon!,
        }}
        handleSubmit={updateSiteMetaData}
      />
      <Form
        title="Open Graph Image"
        description="Select an image that best represents your website on social media platforms and in link previews. This image is crucial for engaging users on social media."
        helpText="Optimal size is 1200x630 pixels."
        inputAttrs={{
          name: "openGraph",
          type: "file",
          defaultValue: data?.openGraph!,
        }}
        handleSubmit={updateSiteMetaData}
      />
    </div>
  );
}
