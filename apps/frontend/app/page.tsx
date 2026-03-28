"use client";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArtistCard, Button, ResourceTileList, TrackCard } from "@mda/components";
import useNewestTracks from "../swrHooks/useNewestTracks";
import useNewestArtists from "../swrHooks/useNewestArtists";

// export default function HomePage() {
//   const router = useRouter();
//   return (
//     <div className="flex flex-col items-center py-2 w-full">
//       <section id="beta-banner" className="bg-yellow-800 w-full p-2 mb-4">
//         <p className="text-center text-sm">
//           🚧 This site is currently in beta. Some features may not work as
//           expected. Please report any bugs or issues you encounter. 🚧
//         </p>
//       </section>
//       <div id="hero" className="overflow-y-scroll">
//         <section className="container relative h-96">
//           <img
//             src="/img/marcela-laskoski-YrtFlrLo2DQ-unsplash.jpg"
//             alt=""
//             className="relative rounded-lg object-none object-bottom-left w-full"
//           />
//           <div className="px-4 py-8 absolute top-0 left-0 text-white bg-black bg-opacity-50 rounded-lg m-4 md:w-2/3">
//             <p
//               className={`text-4xl font-bold opacity-100 ${unbounded.className}`}
//             >
//               Discover new music with OffBeat
//             </p>
//             <p className="mb-4">
//               There are thousands of songs out there. Let us help you find the
//               ones you'll love. Our mission is to help you discover hidden gems
//               from independent musicians around the world. We believe that music
//               should be accessible to everyone, and that great music can come
//               from anywhere.
//             </p>
//             <Link href="/discover" className="underline">
//               🎶 Discover new music now 🎶
//             </Link>
//             <p className="text-right text-xs mt-2 opacity-30">
//               Photo by{" "}
//               <a href="https://unsplash.com/@marcelalaskoski?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
//                 Marcela Laskoski
//               </a>{" "}
//               on{" "}
//               <a href="https://unsplash.com/photos/selective-focus-silhouette-photography-of-man-playing-red-lighted-dj-terminal-YrtFlrLo2DQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
//                 Unsplash
//               </a>
//             </p>
//           </div>
//         </section>
//         <section className="container relative h-96 overflow-hidden">
//           <img
//             src="/img/eric-nopanen-8e0EHPUx3Mo-unsplash.jpg"
//             alt=""
//             className="relative rounded-lg object-none object-bottom-left w-full"
//           />
//           <div className="p-4 absolute top-0 right-0 text-white bg-black bg-opacity-50 rounded-lg m-4 md:w-2/3">
//             <p className={`mt-4 text-4xl font-bold ${unbounded.className}`}>
//               For Artists. For Fans. <br /> For Everyone. <br />
//               For free.
//             </p>
//             <p>
//               We are not a subscription service. Our platform is free to use for
//               all users.
//             </p>
//             <p className="mb-4">
//               There are thousands of songs out there. Let us help you find the
//               ones you'll love.
//             </p>
//             <Link href="/discover" className="underline">
//               🎶 Disover NEW music NOW 🎶‼️
//             </Link>
//             <p className="text-right text-xs mt-2 opacity-30">
//               Photo by{" "}
//               <a href="https://unsplash.com/@rexcuando?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
//                 Eric Nopanen
//               </a>{" "}
//               on{" "}
//               <a href="https://unsplash.com/photos/woman-laying-on-bed-near-gray-radio-8e0EHPUx3Mo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
//                 Unsplash
//               </a>
//             </p>
//           </div>
//         </section>
//         <section className="container relative h-96 overflow-hidden">
//           <img
//             src="/img/norman-hermle-MMqbhMWpqg8-unsplash.jpg"
//             alt=""
//             className="relative rounded-lg object-contain object-bottom-left w-full"
//           />
//           <div className="px-4 py-8  absolute top-0 left-0 text-white bg-black bg-opacity-50 rounded-lg m-4 md:w-2/3">
//             <p className={`mt-4 text-3xl font-bold ${unbounded.className}`}>
//               The Algorithm Hates You (but we don't)
//             </p>
//             <p className="mb-4">
//               We don't believe that only the most popular artists deserve to be
//               heard - that's why we focus on independent musicians. Artists
//               don't need to pay distribution fees or compete for attention with
//               major labels. Fans get to explore a diverse range of music without
//               being bombarded by ads or algorithms that prioritize profit over
//               quality.
//             </p>
//             <Link href="/discover" className="underline">
//               🎶 Have we mentioned YOU could discover NEW music NOW⁉️ 👀 🎶
//             </Link>
//             <p className="text-right text-xs mt-2 opacity-30">
//               Photo by{" "}
//               <a href="https://unsplash.com/@normancuttel?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
//                 Norman Hermle
//               </a>{" "}
//               on{" "}
//               <a href="https://unsplash.com/photos/black-remote-control-beside-black-computer-keyboard-MMqbhMWpqg8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
//                 Unsplash
//               </a>
//             </p>
//           </div>
//         </section>
//       </div>
//       <button
//         className="text-white p-3 border-2 border-white rounded-lg mt-8 hover:bg-white hover:text-black transition"
//         onClick={() => router.push(`/discover`)}
//       >
//         Discover New Music. Now.
//       </button>
//     </div>
//   );
// }

type TrackResult = {
  _id: string;
  title: string;
  artistName: string;
  artistSlug: string;
  genre: string;
  trackArt?: string;
  slug: string;
};

type ArtistResult = {
  _id: string;
  name: string;
  genre: string;
  slug: string;
};

export default function HomePage() {
  const router = useRouter();
  const { newestTracks, isLoading: isLoadingTracks } = useNewestTracks();
  const { newestArtists, isLoading: isLoadingArtists } = useNewestArtists();

  let recentTracksContent: ReactNode;
  if (isLoadingTracks) {
    recentTracksContent = <p>Loading...</p>;
  } else if (newestTracks && newestTracks.length > 0) {
    recentTracksContent = (
      <ResourceTileList
        resourceTiles={(newestTracks as TrackResult[]).map((track) => (
          <TrackCard
            key={track._id}
            title={track.title}
            artist={track.artistName}
            genre={track.genre}
            imageUrl={
              track.trackArt
                ? `data:image/jpeg;base64,${track.trackArt}`
                : undefined
            }
            artistSlug={track.artistSlug}
            trackSlug={track.slug}
          />
        ))}
      />
    );
  } else {
    recentTracksContent = <p>No tracks found.</p>;
  }

  let artistsContent: ReactNode;
  if (isLoadingArtists) {
    artistsContent = <p>Loading...</p>;
  } else if (newestArtists && newestArtists.length > 0) {
    artistsContent = (
      <ResourceTileList
        resourceTiles={(newestArtists as ArtistResult[]).map((artist) => (
          <Link key={artist._id} href={`/artists/${artist.slug}`}>
            <ArtistCard
              name={artist.name}
              meta={artist.genre}
              genre={artist.genre}
              imageUrl=""
            />
          </Link>
        ))}
      />
    );
  } else {
    artistsContent = <p>No artists found.</p>;
  }

  return (
    <div className="flex flex-col w-full">
      {/* <section id="beta-banner" className="bg-yellow-800 w-full p-2 mb-4">
        <p className="text-center text-sm">
          🚧 This site is currently in beta. Some features may not work as
          expected. Please report any bugs or issues you encounter. 🚧
        </p>
      </section> */}
      <div>
        <section id="ui-hero" className="p-8">
          <p
            id="hero-headline"
            className="font-display text-ob-hero font-bold max-w-full leading-tight mb-4"
          >
            Music that hasn't been found yet.
          </p>
          <p className="text-ob-secondary">
            Independent artists. No algorithms. No playlists curated by a
            committee. Just music from people who made it.
          </p>
          <div className="flex gap-4 mt-4">
            <Button
              label="Start Discovering"
              category="primary"
              onClick={() => router.push(`/discover`)}
            />
            <Button
              label="Add your music"
              category="outline"
              onClick={() => router.push(`/artist/dashboard`)}
            />
          </div>
        </section>
        <hr />
        <section className="p-8">
          <p className="font-mono text-ob-label uppercase text-ob-secondary mb-4">
            Recently Added
          </p>
          {recentTracksContent}
        </section>
        <hr />
        <section className="p-8">
          <p className="font-mono text-ob-label uppercase text-ob-secondary mb-4">
            Artists
          </p>
          {artistsContent}
        </section>
      </div>
    </div>
  );
}
