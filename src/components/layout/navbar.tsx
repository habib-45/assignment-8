"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Building2Icon,
  CalendarDaysIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  PlusCircleIcon,
  UserRoundIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NAV_LINKS } from "@/lib/constants";
import { getInitials } from "@/lib/format";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "cn";

const USER_MENU_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/add-studio", label: "Add New Studio", icon: PlusCircleIcon },
  { href: "/my-listings", label: "My Studio Listings", icon: Building2Icon },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarDaysIcon },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await logout();
      setSheetOpen(false);
      toast.success("Signed out", {
        description: "See you next time — your studio hunt awaits.",
      });
      router.push("/");
    } catch {
      toast.error("Sign out failed", {
        description: "Please try again in a moment.",
      });
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                isActive(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {link.label}
              {isActive(link.href) ? (
                <span
                  aria-hidden
                  className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-primary"
                />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {loading ? (
            <div className="flex items-center gap-2">
              <span className="hidden h-8 w-20 rounded-lg bg-muted sm:block" />
              <span className="h-8 w-8 rounded-full bg-muted" />
            </div>
          ) : user ? (
            /* Authenticated state: avatar + dropdown */
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger
                className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-label="Open account menu"
              >
                <Avatar className="size-9 ring-1 ring-border">
                  <AvatarImage
                    src={user.image}
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-1.5">
                <DropdownMenuLabel className="gap-2.5 p-2 font-normal">
                  <span className="flex items-center gap-2.5">
                    <Avatar className="size-9">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {user.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </span>
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {USER_MENU_ITEMS.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    render={<Link href={item.href} />}
                    onClick={() => setMenuOpen(false)}
                    className="gap-2.5 py-2"
                  >
                    <item.icon className="size-4 text-muted-foreground" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  disabled={signingOut}
                  onClick={handleLogout}
                  className="gap-2.5 py-2"
                >
                  <LogOutIcon className="size-4" />
                  {signingOut ? "Signing out…" : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Unauthenticated state: login + register actions */
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-4 font-semibold"
                render={<Link href="/login" />}
              >
                Login
              </Button>
              <Button
                size="lg"
                className="rounded-xl px-4 font-semibold"
                render={<Link href="/register" />}
              >
                Register
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open navigation menu"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="w-[19rem] gap-0 p-0 sm:max-w-[19rem]">
              <SheetHeader className="border-b px-4 py-3.5">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                <nav aria-label="Mobile" className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSheetOpen(false)}
                      aria-current={
                        isActive(link.href) ? "page" : undefined
                      }
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="my-3 h-px bg-border" />

                {user ? (
                  <div className="flex flex-col gap-1">
                    <div className="mb-1 flex items-center gap-2.5 px-3">
                      <Avatar className="size-9">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-semibold">
                          {user.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </span>
                    </div>
                    {USER_MENU_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <item.icon className="size-4" />
                        {item.label}
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={signingOut}
                      className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
                    >
                      <LogOutIcon className="size-4" />
                      {signingOut ? "Signing out…" : "Logout"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-1">
                    <Button
                      size="lg"
                      className="h-11 rounded-xl font-semibold"
                      render={<Link href="/login" />}
                      onClick={() => setSheetOpen(false)}
                    >
                      Login
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-11 rounded-xl font-semibold"
                      render={<Link href="/register" />}
                      onClick={() => setSheetOpen(false)}
                    >
                      Create account
                    </Button>
                    <p className="flex items-center gap-2 px-1 pt-1 text-xs text-muted-foreground">
                      <UserRoundIcon className="size-3.5" />
                      Host your space and earn on every shoot hour.
                    </p>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
