import useSWR from "swr";
import axiosInstance from "../../../util/axiosInstance";
import setFavoriteArtist from "../../../actions/setFavoriteArtist";
import setFavoriteTrack from "../../../actions/setFavoriteTrack";
import { UserFavoriteArtist, UserFavoriteTrack } from "@mda/components";

const fetcher = (url: string) => axiosInstance(url).then((res) => res.data);

export const UserFavorites = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/user/favorites?includeTrackArtistData=true",
    fetcher,
  );
  if (data) {
    console.log(data);
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleRemoveFavoriteTrack = async (trackId: string) => {
    // Implement the logic to remove favorite track
    console.log("Remove favorite track:", trackId);
    try {
      await setFavoriteTrack(trackId, true);
      mutate();
    } catch (error) {
      console.error("Error removing favorite track:", error);
    }
  };

  const handleRemoveFavoriteArtist = async (artistId: string) => {
    // Implement the logic to remove favorite artist
    console.log("Remove favorite artist:", artistId);
    try {
      await setFavoriteArtist(artistId, true);
      mutate();
    } catch (error) {
      console.error("Error removing favorite artist:", error);
    }
  };

  return (
    <div>
      <section id="favorite-tracks" className="mb-6">
        <h2 className="text-ob-label uppercase text-brand-mid tracking-label font-mono mb-2">
          Favorite Tracks
        </h2>
        {data.favorites.favoriteTracks.length === 0 ? (
          <p className="p-2">No favorite tracks found.</p>
        ) : (
          <div className="w-full">
            {data.favorites.favoriteTracks.map((track: any) => (
              <UserFavoriteTrack
                key={track._id}
                trackTitle={track.title}
                artistName={track.artistName}
                artistSlug={track.artistSlug}
                trackSlug={track.slug}
                imgUrl={track.imgUrl}
                genre={track.genre}
              />
            ))}
          </div>
        )}
      </section>
      <hr />
      <section id="favorite-artists" className="mb-6 mt-6">
        <h2 className="text-ob-label uppercase text-brand-mid tracking-label font-mono mb-2">
          Favorite Artists
        </h2>
        <div className="w-full">
          {data.favorites.favoriteArtists.length === 0 ? (
            <p className="p-2 table-cell">No favorite artists found.</p>
          ) : (
            data.favorites.favoriteArtists.map((artist: any) => (
              <UserFavoriteArtist
                key={artist._id}
                name={artist.name}
                genre={artist.genre}
                artistSlug={artist.slug}
                avatarUrl={artist.avatarUrl}
                onClickDelete={() => {
                  const confirmDelete = confirm(
                    "Are you sure you want to remove this artist from your favorites?",
                  );
                  if (confirmDelete) {
                    handleRemoveFavoriteArtist(artist._id);
                  }
                }}
              />
              // <div key={artist.id} className="table-row hover:bg-gray-900">
              //   <div className="p-2 table-cell">{artist.name}</div>
              //   <div className="p-2 table-cell align-middle w-16">
              //     <button
              //       className="block m-auto hover:text-red-700"
              //       onClick={() => {
              //         const confirmDelete = confirm(
              //           "Are you sure you want to remove this artist from your favorites?",
              //         );
              //         if (confirmDelete) {
              //           handleRemoveFavoriteArtist(artist._id);
              //         }
              //       }}
              //     >
              //       <svg
              //         xmlns="http://www.w3.org/2000/svg"
              //         fill="none"
              //         viewBox="0 0 24 24"
              //         stroke-width="1.5"
              //         stroke="currentColor"
              //         class="size-6"
              //       >
              //         <path
              //           stroke-linecap="round"
              //           stroke-linejoin="round"
              //           d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              //         />
              //       </svg>
              //     </button>
              //   </div>
              //   <div className="p-2 table-cell m-auto align-middle w-16">
              //     <Link
              //       href={`/artists/${artist.slug}`}
              //       className="block m-auto hover:text-gray-700"
              //     >
              //       <svg
              //         xmlns="http://www.w3.org/2000/svg"
              //         fill="none"
              //         viewBox="0 0 24 24"
              //         stroke-width="1.5"
              //         stroke="currentColor"
              //         class="size-6"
              //       >
              //         <path
              //           stroke-linecap="round"
              //           stroke-linejoin="round"
              //           d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              //         />
              //         <path
              //           stroke-linecap="round"
              //           stroke-linejoin="round"
              //           d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              //         />
              //       </svg>
              //     </Link>
              //   </div>
              // </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
