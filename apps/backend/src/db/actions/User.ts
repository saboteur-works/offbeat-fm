import { IUser, IUserSignup } from "@common/types/src/types";
import User from "../models/User";
import Artist from "../models/Artist";
import Track from "../models/Track";
import Album from "../models/Album";
import { deleteFile, deleteFolder } from "../../cloud/storage";

/**
 * Create a new user in the database. Duplicate usernames or emails will throw an error.
 * @param user - User signup information
 * @returns The created user document
 * @throws Error if username or email is already in use
 */
export const createUser = async (user: IUserSignup) => {
  try {
    const newUser = new User({
      username: user.username,
      email: user.email,
      password: user.password,
      accountStatus: "pending",
      role: "user",
    });
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error}`);
  }
};

export const getUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

export const setVerificationToken = async (
  userId: string,
  tokenHash: string,
  expiry: Date,
) => {
  await User.findByIdAndUpdate(userId, {
    emailVerificationToken: tokenHash,
    emailVerificationExpiry: expiry,
  });
};

export const getUserByVerificationToken = async (tokenHash: string) => {
  return User.findOne({
    emailVerificationToken: tokenHash,
    emailVerificationExpiry: { $gt: new Date() },
  });
};

export const clearVerificationToken = async (userId: string) => {
  await User.findByIdAndUpdate(userId, {
    accountStatus: "active",
    $unset: { emailVerificationToken: 1, emailVerificationExpiry: 1 },
  });
};

/**
 * Sets the user's status
 * @param userId
 * @param status
 * @returns
 */
export const setUserStatus = async (
  userId: string,
  status: "pending" | "active" | "inactive" | "banned",
) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { accountStatus: status },
      { new: true },
    );
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return user;
  } catch (error) {
    throw new Error(`Error setting user status: ${error}`);
  }
};

/**
 * Retrieve a user by their ID.
 * @param userId - The ID of the user to retrieve
 * @returns The user document or null if not found
 */
export const getUserById = async (userId: string) => {
  try {
    const user = await User.findById(userId).select(
      "username email favoriteArtists favoriteAlbums favoriteTracks",
    );
    return user;
  } catch (error) {
    throw new Error(`Error retrieving user: ${error}`);
  }
};

/**
 * Retrieve artists managed by a specific user.
 * @param userId - The user ID to filter artists by
 * @returns An array of managed artist documents
 */
export const getManagedArtists = async (userId: string) => {
  try {
    const artists = await Artist.find({ managingUserId: userId }).select(
      "name",
    );
    return artists;
  } catch (error) {
    throw new Error(`Error retrieving managed artists: ${error}`);
  }
};

/**
 * Update a user's information.
 * @param userId - The ID of the user to update
 * @param updates - The updates to apply
 * @returns The updated user document
 * @throws Error if user is not found
 */
export const updateUser = async (userId: string, updates: Partial<IUser>) => {
  try {
    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("username email favoriteArtists favoriteAlbums favoriteTracks");
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error}`);
  }
};
/**
 * Add a favorite artist to a user's profile.
 * @param userId - The ID of the user
 * @param artistId - The ID of the artist
 * @returns The updated user document
 * @throws Error if user or artist is not found, or if the artist is already in the user's favorites
 */
export const addFavoriteArtist = async (userId: string, artistId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const artist = await Artist.findById(artistId);
  if (!artist) {
    throw new Error(`Artist with ID ${artistId} not found`);
  }

  if (user.favoriteArtists.includes(artistId)) {
    throw new Error(
      `Artist with ID ${artistId} is already in user's favorite list`,
    );
  }
  user.favoriteArtists.push(artistId);
  await user.save();
  return user.favoriteArtists;
};

/**
 * Remove a favorite artist from a user's profile.
 * @param userId - The ID of the user
 * @param artistId - The ID of the artist
 * @returns The updated user document
 * @throws Error if user or artist is not found, or if the artist is not in the user's favorites
 */
export const removeFavoriteArtist = async (
  userId: string,
  artistId: string,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  const artist = await Artist.findById(artistId);
  if (!artist) {
    throw new Error(`Artist with ID ${artistId} not found`);
  }

  if (!user.favoriteArtists.includes(artistId)) {
    throw new Error(
      `Artist with ID ${artistId} is not in user's favorite list`,
    );
  }

  user.favoriteArtists = user.favoriteArtists.filter(
    (fav) => fav.toString() !== artist._id.toString(),
  );

  await user.save();
  return user.favoriteArtists;
};

/**
 * Add a favorite album to a user's profile.
 * @param userId - The ID of the user
 * @param albumId - The ID of the album
 * @returns The updated user document
 * @throws Error if user or album is not found, or if the album is already in the user's favorites
 */
export const addFavoriteAlbum = async (userId: string, albumId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const album = await Album.findById(albumId);
  if (!album) {
    throw new Error(`Album with ID ${albumId} not found`);
  }

  if (user.favoriteAlbums.includes(albumId)) {
    throw new Error(
      `Album with ID ${albumId} is already in user's favorite list`,
    );
  }
  user.favoriteAlbums.push(albumId);
  await user.save();
  return user.favoriteAlbums;
};

export const removeFavoriteAlbum = async (userId: string, albumId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  const album = await Album.findById(albumId);
  if (!album) {
    throw new Error(`Album with ID ${albumId} not found`);
  }

  if (!user.favoriteAlbums.includes(albumId)) {
    throw new Error(`Album with ID ${albumId} is not in user's favorite list`);
  }

  user.favoriteAlbums = user.favoriteAlbums.filter(
    (fav) => fav.toString() !== album._id.toString(),
  );

  await user.save();
  return user.favoriteAlbums;
};

/**
 * Add a track to a user's list of favorite tracks.
 * @param userId - The ID of the user
 * @param trackId - The ID of the track
 * @returns The updated user document
 * @throws Error if user or track is not found, or if the track is already in the user's favorites
 */
export const addFavoriteTrack = async (userId: string, trackId: string) => {
  try {
    const track = await Track.findById(trackId);
    if (!track) {
      throw new Error(`Track with ID ${trackId} not found`);
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favoriteTracks: trackId } },
      { new: true },
    );
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return user?.favoriteTracks;
  } catch (error) {
    throw new Error(`Error adding favorite track: ${error}`);
  }
};

/**
 * Retrieve a user's favorite tracks.
 * @param userId - The ID of the user
 * @returns An array of favorite track documents
 * @throws Error if user is not found or if there's a database error
 */
export const getFavoriteTracks = async (userId: string) => {
  try {
    const user = await User.findById(userId).populate("favoriteTracks");
    return user?.favoriteTracks || [];
  } catch (error) {
    throw new Error(`Error retrieving favorite tracks: ${error}`);
  }
};

/**
 * Retrieve a user's favorite artists.
 * @param userId - The ID of the user
 * @returns An array of favorite artist documents
 * @throws Error if user is not found or if there's a database error
 */
export const getFavoriteArtists = async (userId: string) => {
  try {
    const user = await User.findById(userId).populate("favoriteArtists");
    return user?.favoriteArtists || [];
  } catch (error) {
    throw new Error(`Error retrieving favorite artists: ${error}`);
  }
};

/**
 * Retrieve a user's favorite tracks, artists, and albums.
 * @param userId - The ID of the user
 * @returns An object containing arrays of favorite tracks, artists, and albums
 * @throws Error if user is not found or if there's a database error
 */
export const getFavorites = async (
  userId: string,
  includeTrackArtistData: boolean = false,
) => {
  try {
    const user = await User.aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: "tracks",
          localField: "favoriteTracks",
          foreignField: "_id",
          as: "favoriteTracks",
          pipeline: [
            // lookup the track's artist and project artist.slug as artistSlug
            {
              $lookup: {
                from: "artists",
                let: { artistId: "$artistId" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        // convert the track.artistId (string) to ObjectId for matching
                        $eq: ["$_id", { $toObjectId: "$$artistId" }],
                      },
                    },
                  },
                  { $project: { slug: 1, name: 1 } },
                ],
                as: "artist",
              },
            },
            { $unwind: { path: "$artist", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                title: 1,
                genre: 1,
                trackArt: 1,
                slug: 1,
                artistSlug: "$artist.slug",
                artistName: includeTrackArtistData ? "$artist.name" : undefined,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "artists",
          localField: "favoriteArtists",
          foreignField: "_id",
          as: "favoriteArtists",
          pipeline: [{ $project: { name: 1, artistArt: 1, slug: 1 } }],
        },
      },
    ]);
    return {
      favoriteTracks: user[0]?.favoriteTracks || [],
      favoriteArtists: user[0]?.favoriteArtists || [],
    };
  } catch (error) {
    throw new Error(`Error retrieving favorites: ${error}`);
  }
};

/**
 * Remove a track from a user's list of favorite tracks.
 * @param userId - The ID of the user
 * @param trackId - The ID of the track to remove
 * @returns  The updated list of favorite tracks
 * @throws Error if user or track is not found, or if there's a database error
 */
export const removeFavoriteTrack = async (userId: string, trackId: string) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteTracks: trackId } },
      { new: true },
    ).orFail(new Error(`User with ID ${userId} not found`));
    return user?.favoriteTracks;
  } catch (error) {
    throw new Error(`Error removing favorite track: ${error}`);
  }
};
/**
 * Delete a user and all associated data (managed artists, albums, tracks).
 * @param userId - The ID of the user to delete
 * @returns True if deletion was successful
 * @throws Error if user is not found or if there's a database error
 */
export const deleteUser = async (userId: string) => {
  // const user = await User.findById(userId);
  // if (!user) {
  //   throw new Error(`User with ID ${userId} not found`);
  // }
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new Error(`User with ID ${userId} not found`);
  }

  // deleteFolder(user.username);
  const artistsManaged = await Artist.find({ managingUserId: userId });
  if (artistsManaged.length > 0) {
    for (const artist of artistsManaged) {
      const artistId = artist._id.toString();
      await Track.deleteMany({ artistId });
      await Album.deleteMany({ artistId });
      await artist.deleteOne();
      await User.updateMany(
        { favoriteArtists: artistId },
        { $pull: { favoriteArtists: artistId } },
      );
      await User.updateMany(
        { favoriteAlbums: { $in: artist.albums } },
        { $pull: { favoriteAlbums: { $in: artist.albums } } },
      );
      await User.updateMany(
        { favoriteTracks: { $in: artist.tracks } },
        { $pull: { favoriteTracks: { $in: artist.tracks } } },
      );
    }
  }
  return true;
};
