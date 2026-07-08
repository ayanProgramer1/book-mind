import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "./register-form";
import { getServerDictionary } from "@/i18n/server";

export const metadata: Metadata = { title: "Creează cont" };

export default async function RegisterPage() {
  const t = await getServerDictionary();
  return (
    <Card className="glass w-full max-w-lg shadow-glass">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">{t.auth.registerTitle}</CardTitle>
        <CardDescription>{t.auth.registerSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
