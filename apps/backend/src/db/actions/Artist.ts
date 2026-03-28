import {
  IArtist,
  NewArtist,
  ServerEditableArtist,
} from "@common/types/src/types";
import Artist from "../models/Artist";
import User from "../models/User";
import Album from "../models/Album";
import Track from "../models/Track";
import { deleteFile, upload } from "../../cloud/storage";
import { createImagePath } from "../../utils/imageUtilities";

// NOTE: Return values from mongoose documents with Map fields need to be converted to JSON with
// flattenMaps:true option to avoid issues in tests and serialization

/**
 * Create a new artist in the database. The managing user must exist.
 * @param userId - ID of the user managing the artist
 * @param artistData - Artist information
 * @returns The created artist document
 * @throws Error if managing user does not exist or if artist name is not unique
 */
export const createArtist = async (
  userId: string,
  artistData: NewArtist,
  artistArt?: Express.Multer.File,
) => {
  try {
    const managingUser = await User.findById(userId);
    if (!managingUser) {
      throw new Error(`User with ID ${userId} not found`);
    }
    let artistArtDestination = null;
    if (artistArt) {
      artistArtDestination = await upload(
        managingUser.id,
        createImagePath(managingUser, artistArt, artistData.name),
        artistArt,
      );
      artistData.artistArt = artistArtDestination;
    }
    const newArtist = new Artist({
      ...artistData,
      links: { ...(artistData.links || {}) },
      managingUserId: userId,
    });
    await newArtist.save();
    return newArtist.toJSON({ flattenMaps: true });
  } catch (error) {
    throw new Error(`Error creating artist: ${error}`);
  }
};

export const getAllArtists = async (): Promise<IArtist[]> => {
  const artists = await Artist.find();
  return artists.map((artist) =>
    artist.toJSON({ flattenMaps: true }),
  ) as IArtist[];
};

/**
 * Retrieve an artist by their ID.
 * @param artistId - The ID of the artist to retrieve
 * @returns The artist document or null if not found
 */
export const getArtistById = async (artistId: string) => {
  const artist = await Artist.findById(artistId).populate("tracks");
  return artist?.toJSON({ flattenMaps: true }) || null;
};

export const getArtistBySlug = async (slug: string) => {
  const artist = await Artist.findOne({ slug }).populate("tracks");
  return artist?.toJSON({ flattenMaps: true }) || null;
};

export const getArtistsByIds = async (artistIds: string[]) => {
  const artists = await Artist.find({ _id: { $in: artistIds } });
  return artists.map((artist) =>
    artist.toJSON({ flattenMaps: true }),
  ) as IArtist[];
};

export const getNewestArtists = async (count: number): Promise<IArtist[]> => {
  const artists = await Artist.find().sort({ _id: -1 }).limit(count);
  return artists.map((a) => a.toJSON({ flattenMaps: true })) as IArtist[];
};

export const getRandomArtists = async (
  count: number,
  excludeArtists?: string[],
) => {
  const artists = await Artist.aggregate([
    { $match: { _id: { $nin: excludeArtists || [] } } },
    { $sample: { size: count } },
  ]);
  return artists;
};

export const getSimilarArtists = async (artistId: string, count: number) => {
  try {
    const artist = await Artist.findById(artistId);
    if (!artist) {
      throw new Error(`Artist with ID ${artistId} not found`);
    }
    const genre = artist.genre;

    const similarArtists = await Artist.aggregate([
      { $match: { _id: { $ne: artist._id }, genre: genre } },
      { $sample: { size: count } },
      {
        $project: {
          name: 1,
          slug: 1,
        },
      },
    ]);
    return similarArtists;
  } catch (error) {
    throw new Error(`Error retrieving similar artists: ${error}`);
  }
};

/**
 * Update an artist's information.
 * @param artistId - The ID of the artist to update
 * @param updateData - The updates to apply (excluding managingUserId)
 * @returns The updated artist document
 * @throws Error if artist is not found
 */
export const updateArtist = async (
  userId: string,
  artistId: string,
  updateData: ServerEditableArtist,
  artistArt?: Express.Multer.File,
) => {
  try {
    const user = await User.findById(userId);
    const artist = await Artist.findById(artistId);

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    if (artist?.managingUserId.toString() !== userId.toString()) {
      throw new Error(
        `User with ID ${userId} is not authorized to update this artist (${artist?.managingUserId})`,
      );
    }

    let artistArtDestination = null;

    if (artistArt) {
      artistArtDestination = await upload(
        user.id,
        createImagePath(user, artistArt, artist.name),
        artistArt,
      );
    }

    const updatePayload = {
      ...updateData,
      artistArt: artistArtDestination,
    };

    const updatedArtist = await Artist.findByIdAndUpdate(
      artistId,
      updatePayload,
      {
        new: true,
      },
    );

    return updatedArtist?.toJSON({ flattenMaps: true });
  } catch (error) {
    throw new Error(`Error updating artist: ${error}`);
  }
};

/**
 * Delete an artist by their ID. Also deletes associated albums and tracks, and removes the artist from users' favorites.
 * @param userId - The ID of the user attempting to delete the artist
 * @param artistId - The ID of the artist to delete
 * @returns True if deletion was successful
 * @throws Error if artist is not found
 */
export const deleteArtist = async (userId: string, artistId: string) => {
  try {
    const deletedArtist = await Artist.findByIdAndDelete({
      _id: artistId,
      managingUserId: userId,
    });

    if (!deletedArtist) {
      throw new Error(
        `Artist with ID ${artistId} not found or user not authorized`,
      );
    }
    if (deletedArtist.artistArt) {
      await deleteFile(deletedArtist.artistArt);
    }
    await Album.deleteMany({ artistId: artistId });
    await Track.deleteMany({ artistId: artistId });
    await User.updateMany(
      { favoriteArtists: artistId },
      { $pull: { favoriteArtists: artistId } },
    );
    return {
      success: true,
      artist: deletedArtist.toJSON({ flattenMaps: true }),
    };
  } catch (error) {
    throw new Error(`Error deleting artist: ${error}`);
  }
};
