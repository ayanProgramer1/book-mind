"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { prisma } from "@/server/db";
import { signIn } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations/auth";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function registerUser(
  values: unknown,
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Date invalide.",
    };
  }

  const { name, email, occupation, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "Există deja un cont cu acest email." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, occupation, passwordHash },
  });

  // Immediately sign the user in after registration.
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Cont creat, dar autentificarea a eșuat." };
    }
    throw error;
  }

  return { ok: true };
}

export async function loginUser(values: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Date invalide.",
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Email sau parolă incorecte." };
    }
    throw error;
  }

  return { ok: true };
}
