"use client";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarButton,
  Sidebar as SidebarComponent,
  SidebarSection,
} from "@mda/components";
import logOut from "../actions/logout";
import { unsetUser } from "../lib/features/users/userSlice";
import toast from "react-hot-toast";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [favoriteTracks, setFavoriteTracks] = useState([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const getFavorites = async () => {
    if (!user.loggedIn) return;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/favorites`,
      { withCredentials: true },
    );

    setFavoriteArtists(response.data.favorites.favoriteArtists);
    setFavoriteTracks(response.data.favorites.favoriteTracks);
  };

  useEffect(() => {
    getFavorites();
  }, [user]);

  if (
    !user.loggedIn ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/"
  ) {
    return null;
  }

  const goToArtist = (slug: string) => {
    setShowMobileSidebar(false);
    router.push(`/artists/${slug}`);
  };

  const goToTrack = (artistSlug: string, trackSlug: string) => {
    setShowMobileSidebar(false);
    router.push(`/track/${artistSlug}/${trackSlug}`);
  };

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  return (
    <div className="min-w-fit md:overflow-y-auto">
      <div className="flex justify-center md:mt-0 md:mb-4 md:hidden">
        <button
          className="mt-4 hover:bg-gray-400 bg-gray-800 rounded-full flex items-center justify-center p-4"
          onClick={toggleMobileSidebar}
        >
          {/* <svg
            width="32"
            height="32"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 14"
            fill="currentColor"
          >
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M1.25 2.625c0-.207.168-.375.375-.375h3.22c.171 0 .321.117.363.284l.31 1.243c.07.278.32.473.607.473h6.25c.207 0 .375.168.375.375v6.75a.375.375 0 0 1-.375.375H1.625a.375.375 0 0 1-.375-.375zM1.625 1C.728 1 0 1.728 0 2.625v8.75C0 12.273.728 13 1.625 13h10.75c.898 0 1.625-.727 1.625-1.625v-6.75C14 3.728 13.273 3 12.375 3H6.613l-.192-.77A1.625 1.625 0 0 0 4.844 1zm8.251 4.376a.63.63 0 0 1 .249.499V9a1.25 1.25 0 1 1-1.25-1.25V6.704l-2.25.642V9.75a1.25 1.25 0 1 1-1.25-1.25V6.875c0-.279.185-.524.453-.601l3.5-1a.63.63 0 0 1 .548.102"
              clip-rule="evenodd"
            />
          </svg> */}
          <Menu className="size-5" />
        </button>
      </div>
      <div className="hidden md:pl-4 md:flex md:flex-col md:grow md:min-w-content md:overflow-y-scroll">
        <p className="font-bold tracking-display text-ob-h1 mb-4">Library</p>
        <SidebarComponent
          favoriteArtists={favoriteArtists}
          favoriteTracks={favoriteTracks}
          onArtistClick={goToArtist}
          onTrackClick={goToTrack}
        />
        <SidebarSection title="Settings & Logout">
          <SidebarButton
            textAlign="left"
            label="Logout"
            onClick={async () => {
              try {
                const logoutSuccessful = await logOut();
                if (logoutSuccessful) {
                  toast.success("Logged out successfully");
                  dispatch(unsetUser());
                  router.push("/");
                }
              } catch (error) {
                toast.error(
                  "Error during logout. You can log out manually by clearing site cookies.",
                );
                console.error("Error during logout:", error);
              }
            }}
          />
          <SidebarButton
            textAlign="left"
            label="Settings"
            onClick={() => router.push("/settings/user")}
          />
        </SidebarSection>
      </div>

      {showMobileSidebar && (
        <div className="p-4 bg-black w-full h-full absolute md:hidden top-0 left-0 z-50">
          <div className="flex items-center border-b border-gray-300 mb-4">
            <button onClick={toggleMobileSidebar} className="p-2">
              <X className="size-5" />
            </button>
            <p className="text-2xl text-center grow">Library & Settings</p>
          </div>

          <section>
            <SidebarComponent
              favoriteArtists={favoriteArtists}
              favoriteTracks={favoriteTracks}
              onArtistClick={goToArtist}
              onTrackClick={goToTrack}
            />
            <SidebarSection title="Settings & Logout">
              <SidebarButton
                textAlign="left"
                label="Logout"
                onClick={async () => {
                  try {
                    const logoutSuccessful = await logOut();
                    if (logoutSuccessful) {
                      toast.success("Logged out successfully");
                      setShowMobileSidebar(false);
                      dispatch(unsetUser());
                      router.push("/");
                    }
                  } catch (error) {
                    toast.error(
                      "Error during logout. You can log out manually by clearing site cookies.",
                    );
                    console.error("Error during logout:", error);
                  }
                }}
              />
              <SidebarButton
                textAlign="left"
                label="Settings"
                onClick={() => {
                  setShowMobileSidebar(false);
                  router.push("/settings/user");
                }}
              />
            </SidebarSection>
          </section>
        </div>
      )}
    </div>
  );
}
