import { notFound } from "next/navigation";
import CodeViewer from "@/components/code-viewer";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: "An app generated on LlamaCoder.io",
    description: "Prompt: Not available",
    openGraph: {
      images: [`/api/og?prompt=Not+available`],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  if (typeof params.id !== "string") {
    notFound();
  }

  return <div>Share functionality is no longer available.</div>;
}
