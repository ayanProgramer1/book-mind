import { Clouds } from "@/components/clouds";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { BackHomeLink } from "@/components/auth/back-home-link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sky-gradient relative flex min-h-screen flex-col">
      <Clouds />
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <BackHomeLink />
        </div>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-8">
        {children}
      </main>
    </div>
  );
}
