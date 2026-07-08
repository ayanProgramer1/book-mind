"use server";

import bcrypt from "bcryptjs";

import { requireUserId } from "@/lib/session";
import { prisma } from "@/server/db";
import { changePasswordSchema } from "@/lib/validations/auth";

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Changes the signed-in user's password. Verifies the current password first.
 * Works for both Free and Pro users (no plan check).
 */
export async function changePasswordAction(values: unknown): Promise<ActionResult> {
  const userId = await requireUserId();

  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Date invalide.",
    };
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });
  if (!user?.passwordHash) {
    return { ok: false, error: "Contul nu are o parolă setată." };
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return { ok: false, error: "Parola curentă este incorectă." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { ok: true };
}
