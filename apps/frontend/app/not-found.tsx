import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-grow items-center py-2">
      <h2>It looks like this page doesn't exist.</h2>
      <Link href="/discover">Discover New Music</Link>
      <Link href="/">Return to the Home Page</Link>
    </div>
  );
}
