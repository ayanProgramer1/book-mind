import { auth } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Throws if there is no authenticated user. Use inside server actions. */
export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Trebuie să fii autentificat.");
  }
  return session.user.id;
}
