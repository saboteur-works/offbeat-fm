import { ICreateTrack, ITrack, IUser } from "@common/types/src/types";
import Track from "../models/Track";
import User from "../models/User";
import { createImagePath } from "../../utils/imageUtilities";
import { deleteFile, upload } from "../../cloud/storage";
import Artist from "../models/Artist";

/**
 * Creates a new track in the database.
 * @param trackData Data for the track to create
 * @returns The created track
 */
export const createTrack = async (
  managingUser: IUser & { id: string },
  trackData: ICreateTrack,
  trackArt?: Express.Multer.File,
) => {
  if (
    await Track.findOne({
      title: trackData.title,
      artistId: trackData.artistId,
    })
  ) {
    throw new Error(
      `Track with title ${trackData.title} by artist ${trackData.artistId} already exists`,
    );
  }
  let trackArtDestination = null;
  if (trackArt) {
    trackArtDestination = await upload(
      managingUser.id,
      createImagePath(managingUser, trackArt, trackData.title),
      trackArt,
    );
    trackData.trackArt = trackArtDestination;
  }
  const track = new Track({
    ...trackData,
    links: { ...(trackData.links || {}) },
  });
  await track.save();
  return track;
};
/**
 * Retrieve all tracks in the database.
 * @returns All tracks in the database
 */
export const getAllTracks = async (): Promise<ITrack[]> => {
  const tracks = await Track.find();
  return tracks.map((track) => track.toJSON({ flattenMaps: true })) as ITrack[];
};

export const getTrackById = async (trackId: string) => {
  const track = await Track.findById(trackId).populate("artistId", "name slug");
  if (!track) {
    return null;
  }

  return track?.toJSON({ flattenMaps: true }) as ITrack | null;
};

export const getTrackBySlugAndArtist = async (
  trackSlug: string,
  artistSlug: string,
) => {
  const artist = await Artist.findOne({ slug: artistSlug }).select("_id");
  const track = await Track.findOne({
    slug: trackSlug,
    artistId: artist?._id,
  }).populate("artistId", "name slug");
  if (!track) {
    return null;
  }

  return track?.toJSON({ flattenMaps: true }) as ITrack | null;
};

/**
 * Retrieve a random set of tracks from the database.
 * @param count The number of random tracks to retrieve
 * @returns An array of random tracks
 */
export const getRandomTracks = async (count: number) => {
  const tracks = await Track.aggregate([
    { $sample: { size: count } },
    { $addFields: { artistObjId: { $toObjectId: "$artistId" } } }, // convert artistId to ObjectId
    {
      $lookup: {
        from: "artists",
        localField: "artistObjId",
        foreignField: "_id",
        as: "artist",
      },
    },
    { $unwind: "$artist" }, // flatten the artist array
    {
      $project: {
        title: 1,
        artistId: 1,
        duration: 1,
        isrc: 1,
        genre: 1,
        trackArt: 1,
        slug: 1,
        artistName: "$artist.name",
        artistSlug: "$artist.slug",
      },
    },
  ]).exec();
  return tracks;
};

/**
 * Retrieve the newest tracks from the database, sorted by insertion order.
 * @param count The number of tracks to retrieve
 * @returns An array of the newest tracks
 */
export const getNewestTracks = async (count: number) => {
  const tracks = await Track.aggregate([
    { $sort: { _id: -1 } },
    { $limit: count },
    { $addFields: { artistObjId: { $toObjectId: "$artistId" } } },
    {
      $lookup: {
        from: "artists",
        localField: "artistObjId",
        foreignField: "_id",
        as: "artist",
      },
    },
    { $unwind: "$artist" },
    {
      $project: {
        title: 1,
        artistId: 1,
        duration: 1,
        isrc: 1,
        genre: 1,
        trackArt: 1,
        slug: 1,
        artistName: "$artist.name",
        artistSlug: "$artist.slug",
      },
    },
  ]).exec();
  return tracks;
};

/**
 * Retrieve a list of tracks by genre.
 * @param genre The genre to search for
 * @param limit The maximum number of tracks to return
 * @returns An array of tracks matching the genre
 */
export const getTracksByGenre = async (genre: string, limit: number) => {
  const tracks = await Track.aggregate([
    { $match: { genre } },
    { $sample: { size: limit } },
    { $addFields: { artistObjId: { $toObjectId: "$artistId" } } },
    {
      $lookup: {
        from: "artists",
        localField: "artistObjId",
        foreignField: "_id",
        as: "artist",
      },
    },
    { $unwind: "$artist" },
    {
      $project: {
        title: 1,
        slug: 1,
        artistName: "$artist.name",
        artistSlug: "$artist.slug",
      },
    },
  ]).exec();
  return tracks;
};

/**
 * Retrieve a list of tracks by artist ID.
 * @param artistId The artist ID to search for
 * @returns An array of tracks by the specified artist
 */
export const getTracksByArtistId = async (artistId: string) => {
  const tracks = await Track.find({ artistId });
  return tracks;
};

/**
 * Update a track in the database.
 * @param userId The requesting user's ID
 * @param trackId The ID of the track to update
 * @param updateData Data to update the track with
 * @returns The updated track
 * @throws Error if the user is not authorized to update the track or if the track does not exist
 */
export const updateTrack = async (
  userId: string,
  trackId: string,
  updateData: Partial<ITrack>,
  trackArt?: Express.Multer.File,
) => {
  const user = await User.findById(userId);
  const track = await Track.findById(trackId);

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  if (track?.managingUserId !== userId.toString()) {
    throw new Error(
      `User with ID ${userId} is not authorized to update this track`,
    );
  }
  let trackArtDestination = null;

  if (trackArt) {
    trackArtDestination = await upload(
      user.id,
      createImagePath(user, trackArt, track.title),
      trackArt,
    );
    updateData.trackArt = trackArtDestination;
  }
  const updatedTrack = await Track.findByIdAndUpdate(trackId, updateData, {
    new: true,
  });
  if (!updatedTrack) {
    throw new Error(`Track with ID ${trackId} not found`);
  }
  return updatedTrack;
};

/**
 * Delete a track from the database.
 * @param userId The requesting user's ID
 * @param trackId The ID of the track to delete
 * @returns True if the track was deleted, false otherwise
 * @throws Error if the user is not authorized to delete the track or if the track does not exist
 */
export const deleteTrack = async (userId: string, trackId: string) => {
  const user = await User.findById(userId);
  const track = await Track.findById(trackId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  if (track?.managingUserId.toString() !== userId.toString()) {
    throw new Error(
      `User with ID ${userId} is not authorized to delete this track`,
    );
  }
  const deletedTrack = await Track.findByIdAndDelete(trackId);
  await Artist.findByIdAndUpdate(track?.artistId, {
    $pull: { tracks: trackId },
  });
  if (track?.trackArt) {
    await deleteFile(track?.trackArt);
  }
  if (!deletedTrack) {
    throw new Error(`Track with ID ${trackId} not found`);
  }
  return true;
};
