import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { getServerDictionary } from "@/i18n/server";
import { BookSearch } from "./book-search";

export const metadata: Metadata = { title: "Carte nouă" };

export default async function NewBookPage() {
  const t = await getServerDictionary();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t.newBook.title} description={t.newBook.subtitle} />
      <BookSearch />
    </div>
  );
}
