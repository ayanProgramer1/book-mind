"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Check, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { searchBooksAction, confirmBookAction } from "@/server/actions/books";
import type { BookSearchResult } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookCover } from "@/components/app/book-cover";
import { EmptyState } from "@/components/app/empty-state";
import { useT } from "@/i18n/context";

export function BookSearch() {
  const t = useT();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookSearchResult[] | null>(null);
  const [selected, setSelected] = useState<BookSearchResult | null>(null);
  const [isSearching, startSearch] = useTransition();
  const [isConfirming, startConfirm] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function runSearch(value: string) {
    startSearch(async () => {
      const res = await searchBooksAction(value);
      if (res.ok) {
        setResults(res.results);
      } else {
        toast.error(res.error);
        setResults([]);
      }
    });
  }

  function onChange(value: string) {
    setQuery(value);
    setSelected(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setResults(null);
      return;
    }
    debounceRef.current = setTimeout(() => runSearch(value), 450);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length >= 2) runSearch(query);
  }

  function confirm(book: BookSearchResult) {
    startConfirm(async () => {
      const res = await confirmBookAction(book);
      if (res.ok) {
        toast.success(t.newBook.confirmed);
        router.push(`/books/${res.bookId}`);
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.newBook.placeholder}
          className="h-14 rounded-2xl pl-12 pr-4 text-base shadow-soft"
          autoFocus
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-primary" />
        )}
      </form>

      {isSearching && results === null && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="flex gap-4 p-4">
              <Skeleton className="h-28 w-20 rounded-lg" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {results !== null && results.length === 0 && !isSearching && (
        <EmptyState
          title={t.newBook.noResults}
          description={t.newBook.noResultsDesc}
        />
      )}

      <AnimatePresence mode="popLayout">
        {results && results.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {results.map((book) => {
              const isSelected = selected?.externalId === book.externalId;
              return (
                <motion.div
                  key={`${book.source}-${book.externalId}`}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card
                    className={`flex gap-4 p-4 transition-all ${
                      isSelected
                        ? "border-primary/60 shadow-glass ring-2 ring-primary/20"
                        : "hover:border-primary/40 hover:shadow-glass"
                    }`}
                  >
                    <div className="w-20 shrink-0">
                      <BookCover url={book.coverUrl} title={book.title} sizes="80px" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="font-semibold leading-snug">{book.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {book.authors.join(", ") || t.common.unknownAuthor}
                        {book.publishedYear ? ` · ${book.publishedYear}` : ""}
                      </p>
                      {book.description && (
                        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                          {book.description}
                        </p>
                      )}
                      <div className="mt-auto pt-3">
                        {isSelected ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="gradient"
                              disabled={isConfirming}
                              onClick={() => confirm(book)}
                            >
                              {isConfirming ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                              {t.newBook.yesThis}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelected(null)}
                              disabled={isConfirming}
                            >
                              <X className="h-4 w-4" />
                              {t.newBook.no}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelected(book)}
                          >
                            {t.newBook.thisIsBook}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {results === null && !isSearching && (
        <div className="rounded-2xl border border-dashed bg-secondary/30 px-6 py-12 text-center">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary/60" />
          <p className="font-medium">{t.newBook.startTitle}</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            {t.newBook.startDesc}
          </p>
        </div>
      )}
    </div>
  );
}
