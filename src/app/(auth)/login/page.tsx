import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";
import { getServerDictionary } from "@/i18n/server";

export const metadata: Metadata = { title: "Autentificare" };

export default async function LoginPage() {
  const t = await getServerDictionary();
  return (
    <Card className="glass w-full max-w-md shadow-glass">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">{t.auth.loginTitle}</CardTitle>
        <CardDescription>{t.auth.loginSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
