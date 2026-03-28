"use client";
import { Button } from "@mda/components";
import { useState } from "react";
import UserVitalSettings from "./UserVitalSettings";
import useAuth from "../../../swrHooks/useAuth";
import AccessUnauthorized from "../../../commonComponents/AccessUnauthorized";
import { UserFavorites } from "./UserFavorites";
import Link from "next/link";

export default function Page() {
  const { authenticatedUser, isLoading, error } = useAuth();

  const [currentPage, setCurrentPage] = useState("favorites");

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <AccessUnauthorized />;
  }
  return (
    <div className="p-4 overflow-y-auto w-full">
      <h1 className="text-2xl font-bold mb-4">User Settings</h1>
      <div className="flex space-x-4 mb-4">
        <Button
          label="User Favorites"
          category="outline"
          onClick={() => setCurrentPage("favorites")}
        />
        <Link href="/artist/dashboard">
          <Button label="Artist Settings" category="outline" />
        </Link>
        <Button
          label="User Data"
          category="outline"
          onClick={() => setCurrentPage("data")}
        />
      </div>
      <div>
        {currentPage === "favorites" && <UserFavorites />}
        {currentPage === "data" && (
          <UserVitalSettings setCurrentPage={setCurrentPage} />
        )}
      </div>
    </div>
  );
}
