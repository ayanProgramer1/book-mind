import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe base config. No Prisma, no bcrypt — this is imported by the
 * middleware, which runs on the edge runtime. Providers that need Node
 * (Credentials + Prisma) are added in `auth.ts`.
 */
const PROTECTED_PREFIXES = ["/dashboard", "/books", "/history", "/profile"];

export const authConfig = {
  // Trust the deployment host header (required for Auth.js v5 behind a proxy /
  // on hosts like Vercel) so callback URLs resolve correctly in production.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = PROTECTED_PREFIXES.some((p) =>
        nextUrl.pathname.startsWith(p),
      );
      if (isProtected && !isLoggedIn) return false;

      // Send already-authenticated users away from the auth pages.
      const isAuthPage =
        nextUrl.pathname === "/login" || nextUrl.pathname === "/register";
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
