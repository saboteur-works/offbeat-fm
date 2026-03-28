import { Button } from "@mda/components";
import Link from "next/link";

export default function AccessUnauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <h1 className="font-display font-bold">Access Unauthorized</h1>
      <p className="text-lg text-center mb-4 text-brand-mid">
        You do not have permission to access this page. If you're seeing this
        message, it may be because you are not logged in or your session has
        expired.
      </p>
      <p className="text-technical w-1/2 mb-8 text-center">
        If you're logged in, try reloading. If you're not, try logging in and
        navigating back to this page. If the problem persists, please contact
        support.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button label="Go to Login Page" category="outline" />
        </Link>
        <Link href="/discover">
          <Button label="Go to Discover Page" category="outline" />
        </Link>
      </div>
    </div>
  );
}
