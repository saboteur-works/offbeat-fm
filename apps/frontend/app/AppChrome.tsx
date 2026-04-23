"use client";
import { usePathname } from "next/navigation";
import Header from "./login/Header";
import Sidebar from "./Sidebar";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith("/admin");

  if (isAdminPath) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row grow overflow-y-scroll">
        <Sidebar />
        {children}
      </div>
      <footer className="border-t border-ob-border py-4">
        <p className="text-sm text-ob-dim">
          &copy; {new Date().getFullYear()} Saboteur. All rights reserved.
        </p>
      </footer>
    </>
  );
}
