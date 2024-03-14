import prisma from "@/lib/prisma";
import Form from "@/components/form";
import { updateSite } from "@/lib/actions/site";
import DeleteCustomDomainForm from "@/components/form/delete-custom-domain-form";
import DomainConfiguration from "@/components/form/custom-domain-configuration";

export default async function SiteSettingsDomains({
  params,
}: {
  params: { id: string };
}) {
  const data = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
  });

  if (!data) return null;

  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="Subdomain"
        description="The subdomain for your site."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "subdomain",
          type: "text",
          defaultValue: data?.subdomain!,
          placeholder: "subdomain",
          maxLength: 32,
        }}
        handleSubmit={updateSite}
      />
      {data.customDomain ? (
        <DeleteCustomDomainForm siteName={data?.name!} domain={data?.customDomain!} domain_uuid={data?.domain_uuid!} />
      ) : (
        <Form
          title="Custom Domain"
          description="The custom domain for your site."
          helpText="Please enter a valid domain."
          inputAttrs={{
            name: "customDomain",
            type: "text",
            defaultValue: data?.customDomain!,
            placeholder: "yourdomain.com",
            maxLength: 64,
            pattern: "^[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}$",
          }}
          handleSubmit={updateSite}
        />
      )}
      <DomainConfiguration domain_uuid={data?.domain_uuid!} />
    </div>
  );
}
