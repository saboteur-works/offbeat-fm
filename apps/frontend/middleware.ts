import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUBDOMAIN_PREFIXES: Record<string, string> = {
  admin: "/admin",
};

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  // Extract subdomain from both prod (admin.offbeat-fm.com) and local (admin.localhost:3000)
  const subdomain = host.split(".")[0] ?? "";

  const prefix = SUBDOMAIN_PREFIXES[subdomain];
  if (prefix && !request.nextUrl.pathname.startsWith(prefix)) {
    const url = request.nextUrl.clone();
    url.pathname = `${prefix}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
