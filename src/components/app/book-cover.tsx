import Image from "next/image";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function BookCover({
  url,
  title,
  className,
  sizes = "120px",
}: {
  url?: string | null;
  title: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gradient-to-br from-sky-100 to-blue-200 shadow-soft dark:from-slate-800 dark:to-slate-700",
        className,
      )}
    >
      {url ? (
        <Image
          src={url}
          alt={title}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2 text-center">
          <BookOpen className="h-6 w-6 text-primary/60" />
          <span className="line-clamp-3 text-[10px] font-medium text-muted-foreground">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
