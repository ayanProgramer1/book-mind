"use server";

import { requireUserId } from "@/lib/session";
import { prisma } from "@/server/db";
import { searchBooks } from "@/server/books/search";
import { bookSearchResultSchema } from "@/lib/validations/book";
import type { BookSearchResult } from "@/types";

export async function searchBooksAction(
  query: string,
): Promise<{ ok: true; results: BookSearchResult[] } | { ok: false; error: string }> {
  await requireUserId();
  if (query.trim().length < 2) {
    return { ok: true, results: [] };
  }
  try {
    const results = await searchBooks(query);
    return { ok: true, results };
  } catch {
    return { ok: false, error: "Căutarea a eșuat. Încearcă din nou." };
  }
}

export async function confirmBookAction(
  input: unknown,
): Promise<{ ok: true; bookId: string } | { ok: false; error: string }> {
  const userId = await requireUserId();
  const parsed = bookSearchResultSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Date invalide despre carte." };
  }
  const data = parsed.data;

  const book = await prisma.book.create({
    data: {
      userId,
      title: data.title,
      authors: data.authors.join(", ") || null,
      publishedYear: data.publishedYear,
      description: data.description,
      coverUrl: data.coverUrl,
      externalId: data.externalId,
      source: data.source,
    },
  });

  return { ok: true, bookId: book.id };
}
