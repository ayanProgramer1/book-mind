import "server-only";
import type { BookSearchResult } from "@/types";

type GoogleVolume = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  };
};

type OpenLibraryDoc = {
  key: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
};

function yearFromDate(date?: string): string | null {
  if (!date) return null;
  const match = date.match(/\d{4}/);
  return match ? match[0] : null;
}

function httpsCover(url?: string): string | null {
  if (!url) return null;
  return url.replace(/^http:\/\//, "https://");
}

/**
 * Search Google Books first (rich metadata + covers). Falls back to Open Library
 * if Google returns nothing or errors. Both providers are queried over HTTP with
 * a short timeout so the UI stays responsive.
 */
export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const google = await searchGoogleBooks(trimmed);
  if (google.length > 0) return google;

  return searchOpenLibrary(trimmed);
}

async function searchGoogleBooks(query: string): Promise<BookSearchResult[]> {
  try {
    // No langRestrict: return books from all languages/countries, ordered by
    // relevance (Google Books' default). This lets users find any book worldwide.
    const params = new URLSearchParams({
      q: query,
      maxResults: "8",
      printType: "books",
    });
    const key = process.env.GOOGLE_BOOKS_API_KEY;
    if (key) params.set("key", key);

    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?${params.toString()}`,
      { signal: AbortSignal.timeout(8000), next: { revalidate: 0 } },
    );
    if (!res.ok) return [];

    const data = (await res.json()) as { items?: GoogleVolume[] };
    const items = data.items ?? [];

    return items
      .filter((v) => v.volumeInfo?.title)
      .map((v) => {
        const info = v.volumeInfo!;
        return {
          externalId: v.id,
          source: "google_books" as const,
          title: info.title!,
          authors: info.authors ?? [],
          publishedYear: yearFromDate(info.publishedDate),
          description: info.description ?? null,
          coverUrl:
            httpsCover(info.imageLinks?.thumbnail) ??
            httpsCover(info.imageLinks?.smallThumbnail),
        };
      });
  } catch {
    return [];
  }
}

async function searchOpenLibrary(query: string): Promise<BookSearchResult[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      limit: "8",
      fields: "key,title,author_name,first_publish_year,cover_i",
    });
    const res = await fetch(
      `https://openlibrary.org/search.json?${params.toString()}`,
      { signal: AbortSignal.timeout(8000), next: { revalidate: 0 } },
    );
    if (!res.ok) return [];

    const data = (await res.json()) as { docs?: OpenLibraryDoc[] };
    const docs = data.docs ?? [];

    return docs
      .filter((d) => d.title)
      .map((d) => ({
        externalId: d.key,
        source: "open_library" as const,
        title: d.title!,
        authors: d.author_name ?? [],
        publishedYear: d.first_publish_year
          ? String(d.first_publish_year)
          : null,
        description: null,
        coverUrl: d.cover_i
          ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
          : null,
      }));
  } catch {
    return [];
  }
}
