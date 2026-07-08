"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "glass rounded-xl shadow-glass text-sm text-foreground",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}
