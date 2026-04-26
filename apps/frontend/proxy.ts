import axios from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUBDOMAIN_PREFIXES: Record<string, string> = {
  admin: "/admin",
};

// Routes that require authentication (redirect to /login if not authed)
const AUTH_REQUIRED_MATCHER = /^\/experimental(\/|$)/;

export default async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  // Works for both prod (admin.offbeat-fm.com) and local (admin.localhost:3000)
  const subdomain = host.split(".")[0] ?? "";

  const prefix = SUBDOMAIN_PREFIXES[subdomain];
  if (prefix && !request.nextUrl.pathname.startsWith(prefix)) {
    const url = request.nextUrl.clone();
    url.pathname = `${prefix}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Auth-gate specific routes
  if (AUTH_REQUIRED_MATCHER.test(request.nextUrl.pathname)) {
    try {
      let backendUrl: string;
      if (process.env.NODE_ENV === "production") {
        backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth`;
      } else {
        backendUrl = "http://backend:3001/api/v1/auth/check-auth"; // eslint-disable-line sonarjs/no-clear-text-protocols
      }
      const authentication = await axios.get(backendUrl, {
        headers: { cookie: request.headers.get("cookie") ?? "" },
        withCredentials: true,
      });

      if (authentication.status !== 200) {
        throw new Error("Not authenticated");
      }

      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico).*)"],
};
