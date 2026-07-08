import "server-only";
import { cookies } from "next/headers";

import { LOCALE_COOKIE, resolveLocale, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

/** Reads the persisted locale from the request cookie (server components/actions). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return resolveLocale(store.get(LOCALE_COOKIE)?.value);
}

/** Server-side dictionary for the current request locale. */
export async function getServerDictionary() {
  return getDictionary(await getLocale());
}

export { LOCALE_LANGUAGE_NAME } from "./config";
