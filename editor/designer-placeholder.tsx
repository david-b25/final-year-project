import Image from "next/image";

export default function DesignerPlaceholder() {
  return (
    <div className="h-full w-full border border-border rounded-lg flex flex-col items-center space-x-4">
      <Image
        alt="missing site"
        src="/designer-placeholder.svg"
        width={300}
        height={300}
        className="mt-30"
      />
      <h1 className="mb-30 font-cal text-3xl">Drag and Drop Elements</h1>
    </div>
  );
}
