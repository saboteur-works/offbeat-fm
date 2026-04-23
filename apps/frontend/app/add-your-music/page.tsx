"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Button, DisplayTypography, BodyTypography } from "@mda/components";
import { useAppSelector } from "../../lib/hooks";

export default function AddYourMusicPage() {
  const username = useAppSelector((state) => state.user.username);

  useEffect(() => {
    if (username) {
      window.location.href = "https://offbeat-fm.com/artist/dashboard";
    }
  }, [username]);

  if (username) {
    return null;
  }

  return (
    <div className="flex flex-col items-start p-8 max-w-xl">
      <div className="mb-4">
        <DisplayTypography text="Add your music." />
      </div>
      <div className="mb-6">
        <BodyTypography text="Create a free account to upload and manage your music on OffBeat. Once signed up, you can manage your artist profile at offbeat-fm.com/artist/dashboard." />
      </div>
      <div className="flex gap-4">
        <Link href="/signup">
          <Button label="Sign Up" category="primary" />
        </Link>
        <Link href="/login">
          <Button label="Log In" category="outline" />
        </Link>
      </div>
    </div>
  );
}
