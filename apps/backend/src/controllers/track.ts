import { Request, Response } from "express";
import {
  getRandomTracks,
  getNewestTracks,
  getTrackById,
  getTracksByGenre,
  getTracksByArtistId as getTracksByArtistIdAction,
  createTrack,
  updateTrack as updateTrackAction,
  deleteTrack as deleteTrackAction,
  getTrackBySlugAndArtist,
} from "../db/actions/Track";
import { addFavoriteTrack, removeFavoriteTrack } from "../db/actions/User";
import { ITrack } from "@common/types/src/types";
import { getImageAtPath } from "../db/actions/Storage";
import {
  createTrackProfileCreatedEvent,
  createTrackProfileDeletedEvent,
  createTrackProfileUpdatedEvent,
  logServerEvent,
} from "../serverEvents/serverEvents";
import { trackFormValidators } from "@common/validation";
const submitTrack = async (req: Request, res: Response) => {
  try {
    const values = await trackFormValidators.serverCreateTrackSchema.validate(
      req.body,
    );

    const managingUserId: string = req.user._id;
    const trackData = {
      ...values,
      managingUserId,
    };
    if (trackData.isrc === "") {
      trackData.isrc = undefined;
    }
    // Save the track to the database
    const track = await createTrack(req.user, trackData, req.file);
    logServerEvent(
      createTrackProfileCreatedEvent(
        track._id.toString(),
        track.title,
        req.user._id.toString(),
      ),
    );
    return res.status(201).json({ status: "OK", data: track });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ status: "ERROR", message: error.message });
    }
  }
};

const getTrack = async (req: Request, res: Response) => {
  const { trackId } = req.params;
  if (!trackId) {
    return res
      .status(400)
      .json({ status: "ERROR", message: "trackId is required" });
  }

  const track = await getTrackById(trackId);
  if (!track) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "Track not found" });
  }
  let trackArt = null;
  if (track && track.trackArt) {
    const art = await getImageAtPath(track?.trackArt);
    if (art) {
      trackArt = Buffer.from(art).toString("base64");
    }
  }
  return res.status(200).json({ status: "OK", data: { ...track, trackArt } });
};

const getBySlugAndArtist = async (req: Request, res: Response) => {
  const { trackSlug, artistSlug } = req.params;
  if (!trackSlug || !artistSlug) {
    return res
      .status(400)
      .json({ status: "ERROR", message: "slug and artistId are required" });
  }

  const track = await getTrackBySlugAndArtist(trackSlug, artistSlug);
  if (!track) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "Track not found" });
  }
  let trackArt = null;
  if (track && track.trackArt) {
    const art = await getImageAtPath(track?.trackArt);
    if (art) {
      trackArt = Buffer.from(art).toString("base64");
    }
  }
  return res.status(200).json({ status: "OK", data: { ...track, trackArt } });
};

const getTracks = async (req: Request, res: Response) => {
  const { genre } = req.params;
  if (!genre) {
    return res
      .status(400)
      .json({ status: "ERROR", message: "genre is required" });
  }
  const tracks = await getTracksByGenre(genre, 10);
  if (!tracks || tracks.length === 0) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "No tracks found for this genre" });
  }
  return res.status(200).json({ status: "OK", data: tracks });
};

const getSimilarTracks = async (req: Request, res: Response) => {
  const { trackId } = req.params;
  if (!trackId) {
    return res
      .status(400)
      .json({ status: "ERROR", message: "trackId is required" });
  }
  const track = await getTrackById(trackId);
  if (!track) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "Track not found" });
  }
  const genre = track.genre;
  const similarTracks = await getTracksByGenre(genre, 10);
  if (!similarTracks || similarTracks.length === 0) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "No similar tracks found" });
  }
  return res.status(200).json({ status: "OK", data: similarTracks });
};

const getTracksByArtistId = async (req: Request, res: Response) => {
  const { artistId } = req.params;
  if (!artistId) {
    return res
      .status(400)
      .json({ status: "ERROR", message: "artistId is required" });
  }
  const tracks = await getTracksByArtistIdAction(artistId);
  if (!tracks) {
    return res.status(404).json({
      status: "ERROR",
      message: "Error finding tracks for this artist",
    });
  }
  return res.status(200).json({ status: "OK", data: tracks });
};

const getRandom = async (req: Request, res: Response) => {
  const count = 8;
  try {
    const tracks = await getRandomTracks(count);
    const trackReturn = await tracks.reduce(
      async (acc, track: ITrack) => {
        const resolvedAcc = await acc;
        if (track.trackArt) {
          await getImageAtPath(track.trackArt).then((art) => {
            if (art) {
              track.trackArt = Buffer.from(art).toString("base64");
            }
          });
        }
        resolvedAcc.push(track);
        return resolvedAcc;
      },
      [] as typeof tracks,
    );
    res.status(200).json({ status: "OK", data: trackReturn });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ status: "ERROR", message: error.message });
    }
  }
};

const getNewest = async (req: Request, res: Response) => {
  const count = 4;
  try {
    const tracks = await getNewestTracks(count);
    const trackReturn = await tracks.reduce(
      async (acc, track: ITrack) => {
        const resolvedAcc = await acc;
        if (track.trackArt) {
          await getImageAtPath(track.trackArt).then((art) => {
            if (art) {
              track.trackArt = Buffer.from(art).toString("base64");
            }
          });
        }
        resolvedAcc.push(track);
        return resolvedAcc;
      },
      [] as typeof tracks,
    );
    res.status(200).json({ status: "OK", data: trackReturn });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ status: "ERROR", message: error.message });
    }
  }
};

const deleteTrack = async (req: Request, res: Response) => {
  if (!req.params.trackId) {
    return res
      .status(400)
      .json({ status: "ERROR", message: "trackId is required" });
  }
  const result = await deleteTrackAction(req.user._id, req.params.trackId);
  logServerEvent(
    createTrackProfileDeletedEvent(req.params.trackId, req.user._id.toString()),
  );
  res.status(200).json({ status: "OK", data: result });
};

const updateTrack = async (req: Request, res: Response) => {
  try {
    const { trackId } = req.params;
    const userId = req.user._id;
    if (!trackId) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "trackId is required" });
    }
    const values = await trackFormValidators.serverUpdateTrackSchema.validate(
      req.body,
    );
    if (values.isrc === "") {
      values.isrc = undefined;
    }
    const updatedTrack = await updateTrackAction(
      userId,
      trackId,
      values,
      req.file,
    );
    logServerEvent(
      createTrackProfileUpdatedEvent(trackId, req.user._id.toString()),
    );
    return res.status(200).json({ status: "OK", data: updatedTrack });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ status: "ERROR", message: error.message });
    }
  }
};
const setFavorite = async (req: Request, res: Response) => {
  const values = await trackFormValidators.setFavoriteTrackSchema.validate(
    req.body,
  );
  const userId = req.user._id;
  try {
    const { trackId, remove } = values;
    if (remove) {
      const favoriteTracks = await removeFavoriteTrack(userId, trackId);
      return res.status(200).json({ status: "OK", data: favoriteTracks });
    }
    const favoriteTracks = await addFavoriteTrack(userId, trackId);
    return res.status(200).json({ status: "OK", data: favoriteTracks });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ status: "ERROR", message: error.message });
    }
  }
};

export {
  submitTrack,
  getTrack,
  deleteTrack,
  updateTrack,
  getRandom,
  getNewest,
  getTracks,
  getSimilarTracks,
  setFavorite,
  getTracksByArtistId,
  getBySlugAndArtist,
};
