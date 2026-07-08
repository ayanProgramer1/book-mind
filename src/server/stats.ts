import "server-only";
import { prisma } from "@/server/db";

export type UserStats = {
  booksCount: number;
  summariesCount: number;
  testsCompleted: number;
  averageScore: number; // 0..100
  bestScore: number; // 0..100
};

export async function getUserStats(userId: string): Promise<UserStats> {
  const [booksCount, summariesCount, progress] = await Promise.all([
    prisma.book.count({ where: { userId } }),
    prisma.summary.count({ where: { book: { userId } } }),
    prisma.progress.findMany({
      where: { userId },
      select: { percentage: true },
    }),
  ]);

  const testsCompleted = progress.length;
  const averageScore =
    testsCompleted > 0
      ? Math.round(
          progress.reduce((sum, p) => sum + p.percentage, 0) / testsCompleted,
        )
      : 0;
  const bestScore =
    testsCompleted > 0
      ? Math.max(...progress.map((p) => p.percentage))
      : 0;

  return { booksCount, summariesCount, testsCompleted, averageScore, bestScore };
}
