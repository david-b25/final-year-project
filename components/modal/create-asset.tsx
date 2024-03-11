import { createAsset } from "@/lib/actions";
import UploadForm from "@/components/form";

export default function CreateAssetModal() {

  return (
    <div className="w-[500px]">
        <UploadForm
          title="Add media assets here"
          description="Image formats accepted: .png, .jpg, .jpeg or .mp4."
          helpText="Max file size 50MB."
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: "https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/hxfcV5V-eInX3jbVUhjAt1suB7zB88uGd1j20b.png",
          }}
          handleSubmit={createAsset}
        />
    </div>
  )
};