import Image from "next/image";

export default function NotFoundSitePage() {
  return (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">404</h1>
      <Image
        alt="missing page"
        src="https://illustrations.popsy.co/gray/falling.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        Page does not exist, or you do not have permission to edit it
      </p>
    </div>
  );
}
