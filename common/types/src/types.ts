import { MusicPlatformLinks, SocialPlatformLinks } from "@common/json-data";
/**
 * Common types for the music streaming service.
 */
type CommonLinkKeyMusic =
  | "soundcloud"
  | "spotify"
  | "youtube"
  | "appleMusic"
  | "bandcamp";

/**
 * Common social media and website links.
 */
type CommonLinkKeySocial =
  | "facebook"
  | "instagram"
  | "twitterX"
  | "tiktok"
  | "website"
  | "bluesky";

/**
 * A music track/song.
 */
interface ITrack {
  title: string;
  /**
   * A URL-friendly version of the track's title.
   * Does not need to be unique, but care should be taken when querying.
   * */
  slug: string;
  artistId: string;
  albumId: string;
  duration?: number;
  isrc?: string;
  genre: string;
  managingUserId: string;
  trackArt?: string;
  links?: {
    [key in MusicPlatformLinks]?: string;
  };
}

type TrackSubmissionData = Pick<
  ITrack,
  "title" | "genre" | "isrc" | "links"
> & { trackArt?: File | string };

type ICreateTrack = Pick<
  ITrack,
  "artistId" | "title" | "genre" | "isrc" | "links" | "trackArt"
>;

type EditableTrack = Partial<
  Pick<ITrack, "title" | "genre" | "isrc" | "links" | "trackArt">
>;

/**
 * A music album.
 */
interface IAlbum {
  title: string;
  artistId: string;
  releaseDate: Date;
  genre: string;
  managingUserId: string;
  links?: {
    [key in CommonLinkKeyMusic]?: string;
  };
}

type EditableAlbum = Partial<Omit<IAlbum, "artistId">>;

/**
 * A music artist/band.
 */
interface IArtist {
  /** The artist's name. Must be unique. */
  name: string;
  /** A URL-friendly version of the artist's name. Must be unique. */
  slug: string;
  /** The artist's primary genre. */
  genre: string;
  /** A brief biography of the artist. */
  biography?: string;
  /**
   * ID of the user managing this artist's profile.
   */
  managingUserId: string;
  /** A map of social and music platform links. */
  links?: {
    [key in SocialPlatformLinks]?: string;
  };
  /** List of album IDs associated with the artist. */
  albums?: string[];
  /** List of track IDs associated with the artist. */
  tracks?: string[];
  /** S3 location to the artist's artwork/image. */
  artistArt?: string | null;
}

/**
 * Data required for creating a new artist. This type omits fields that are
 * automatically generated or managed by the system.
 *
 * This type is used by the frontend and backend when creating a new artist profile.
 */
type NewArtist = Omit<IArtist, "managingUserId" | "slug" | "albums" | "tracks">;

/**
 * Client data required for editing an artist profile.
 *
 * This type is used by the __frontend__ when editing an artist profile.
 */
type ClientEditableArtist = Partial<
  Pick<IArtist, "name" | "genre" | "biography" | "links">
> & { artistArt: File | string };

/**
 * Server data required for editing an artist profile.
 *
 * This type is used by the __backend__ when editing an artist profile.
 */
type ServerEditableArtist = Partial<
  Pick<IArtist, "name" | "genre" | "biography" | "links">
>;

/**
 * A user of the service.
 */
interface IUser {
  username: string;
  email: string;
  password: string;
  accountStatus: "pending" | "active" | "inactive" | "banned";
  role: "user" | "admin";
  favoriteTracks: string[];
  favoriteAlbums: string[];
  favoriteArtists: string[];
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
}

/**
 * An editorial artist profile created by an OffBeat admin.
 * Artists can discover and claim these profiles, which are then
 * converted into managed Artist documents.
 */
interface IEditorialProfile {
  name: string;
  /** URL-friendly version of the profile name. Auto-generated from name. */
  slug: string;
  genre: string;
  biography?: string;
  artistArt?: string;
  /** Social and music platform links, same shape as IArtist.links. */
  links?: {
    [key in SocialPlatformLinks]?: string;
  };
  /** Usernames of users who have favourited this profile. */
  favoritedBy?: string[];
  /** Internal admin-only notes about the profile. Never exposed publicly. */
  editorialNotes?: string;
  verificationStatus: "unverified" | "pending" | "verified";
  claimStatus: "unclaimed" | "claimed" | "converted";
  /** ID of the user who submitted a claim request. */
  claimedByUserId?: string;
  /** ID of the Artist document created when an approved claim is finalised. */
  convertedArtistId?: string;
  /** ID of the admin who created this profile. */
  createdByAdminId: string;
}

/**
 * Data required for user login.
 *
 * This type is used by the frontend and backend during the login process.
 */
type IUserLogin = Pick<IUser, "username" | "password">;

/**
 * Data required for user signup.
 *
 * This type is used by the frontend and backend during the signup process.
 */
type IUserSignup = Pick<IUser, "username" | "email" | "password">;

export type {
  ITrack,
  IAlbum,
  IArtist,
  IUser,
  IEditorialProfile,
  IUserLogin,
  IUserSignup,
  CommonLinkKeyMusic,
  CommonLinkKeySocial,
  ClientEditableArtist,
  ServerEditableArtist,
  EditableAlbum,
  TrackSubmissionData,
  EditableTrack,
  NewArtist,
  ICreateTrack,
};
