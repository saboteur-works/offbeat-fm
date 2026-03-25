import { Button } from "@mda/components";
import Link from "next/link";

export default function AccessUnauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-3xl font-bold mb-4">Access Unauthorized</h1>
      <p className="text-lg text-center">
        You do not have permission to access this page. This may be due to not
        being logged in or lacking the necessary privileges.
      </p>
      <p>
        You can try to logging in and returning to this page. (If you are
        redirected to the Discover page, you may already be logged in and this
        screen may be an error.)
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
