"use client";
import { Button } from "@mda/components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import axios from "axios";
import { useEffect } from "react";
import { setUser, unsetUser } from "../../lib/features/users/userSlice";
import logOut from "../../actions/logout";
import useAuth from "../../swrHooks/useAuth";
import { IBM_Plex_Sans } from "next/font/google";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ibm-plex-sans",
});

const Header = () => {
  const name = useAppSelector((state) => state.user.username);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { authenticatedUser } = useAuth();

  const checkAuth = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth`,
        { withCredentials: true },
      );
      if (response?.status !== 200) {
        return;
      }
      dispatch(setUser(response.data.user));
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const logoutSuccessful = await logOut();
      if (logoutSuccessful) {
        dispatch(unsetUser());
        router.push("/");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <header className="flex items-center justify-between p-4 border-b border-ob-border">
      <Link
        href="/"
        className={`${ibmPlexSans.className} border-l-[4px] border-ob-red-border pl-6 flex items-center text-ob-h1`}
      >
        <span className="font-display font-bold tracking-wordmark text-ob-primary">
          OffBeat
        </span>
        <span
          className="font-mono font-normal text-ob-red text-ob-h3 align-middle"
          style={{ fontSize: "0.52em", letterSpacing: "0.04em" }}
        >
          FM
        </span>
      </Link>
      <nav>
        <Link href="/discover" className="text-ob-primary text-sm font-medium">
          Discover
        </Link>
      </nav>
      {name ? (
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            label="Logout"
            category="outline"
            onClick={() => {
              handleLogout();
            }}
          />
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button category="outline" label="Login" />
          </Link>
          <Link href="/signup" className="hidden md:flex">
            <Button category="outline" label="Sign Up" />
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
