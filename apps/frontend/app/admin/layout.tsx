"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import useAuth from "../../swrHooks/useAuth";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { authenticatedUser, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoading) return;
    if (isLoginPage) return;
    if (!authenticatedUser?.authenticated || authenticatedUser?.user?.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [authenticatedUser, isLoading, isLoginPage, router]);

  if (!isLoginPage && (isLoading || !authenticatedUser?.authenticated || authenticatedUser?.user?.role !== "admin")) {
    return null;
  }

  return <>{children}</>;
}

function AdminHeader() {
  return (
    <header className="border-b border-ob-border px-6 py-3 flex items-center gap-6">
      <span className="font-bold text-lg tracking-tight">OffBeat Admin</span>
      <nav className="flex gap-4 text-sm">
        <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
        <Link href="/admin/editorial" className="hover:underline">Editorial</Link>
        <Link href="/admin/users" className="hover:underline">Users</Link>
      </nav>
    </header>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="flex flex-col min-h-screen">
      {!isLoginPage && <AdminHeader />}
      <main className="flex-1 p-6">
        <AdminGuard>{children}</AdminGuard>
      </main>
    </div>
  );
}
