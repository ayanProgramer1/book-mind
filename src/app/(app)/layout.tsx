import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { Logo } from "@/components/logo";
import { SidebarNav, MobileNav } from "@/components/app/sidebar-nav";
import { SidebarTip } from "@/components/app/sidebar-tip";
import { UserMenu } from "@/components/app/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-card/50 px-4 py-6 backdrop-blur md:flex">
        <Logo className="mb-8 px-2" />
        <SidebarNav />
        <SidebarTip />
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/80 px-5 py-3 backdrop-blur-xl md:px-8">
          <Logo href="/dashboard" withText={false} className="md:hidden" />
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu name={user.name} email={user.email} image={user.image} />
          </div>
        </header>

        <main className="flex-1 px-5 pb-24 pt-6 md:px-8 md:pb-10">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
