import { Request, Response } from "express";
import {
  createArtist,
  getAllArtists,
  getArtistById,
  deleteArtist as deleteArtistAction,
  updateArtist as updateArtistAction,
  getRandomArtists,
  getNewestArtists as getNewestArtistsAction,
  getSimilarArtists as getSimilarArtistsAction,
  getArtistsByIds,
  getArtistBySlug,
} from "../db/actions/Artist";
import { IArtist } from "@common/types/src/types";
import Joi from "joi";
import { addFavoriteArtist, removeFavoriteArtist } from "../db/actions/User";
import { getImageAtPath } from "../db/actions/Storage";
import {
  createArtistProfileCreatedEvent,
  createArtistProfileDeletedEvent,
  createArtistProfileUpdatedEvent,
  logServerEvent,
} from "../serverEvents/serverEvents";
import { artistFormValidators } from "@common/validation";

export const createNewArtist = async (req: Request, res: Response) => {
  try {
    const validatedFields =
      await artistFormValidators.artistSignupSchema.validate({
        artistName: req.body.name,
        ...req.body,
      });
    const user = req.user;
    const artistData: Omit<IArtist, "managingUserId" | "slug"> = {
      name: validatedFields.artistName,
      genre: validatedFields.genre,
      biography: validatedFields.biography,
      links: validatedFields.links,
    };
    const artist = await createArtist(user._id, artistData, req.file);
    logServerEvent(
      createArtistProfileCreatedEvent(
        artist._id.toString(),
        artist.name,
        user._id.toString(),
      ),
    );
    res.status(200).json({ status: "OK", data: artist });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getArtists = async (req: Request, res: Response) => {
  try {
    const allArtists = await getAllArtists();
    res.status(200).json({ status: "OK", data: allArtists });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getById = async (req: Request, res: Response) => {
  const artistId = req.params.id;
  const returnArtistArt = req.query.includeArt === "true";
  if (!artistId) {
    res.status(400).json({ status: "ERROR", message: "Artist ID is required" });
    return;
  }
  try {
    const artist = await getArtistById(artistId);
    let artistArt = null;
    if (artist && returnArtistArt && artist.artistArt) {
      const art = await getImageAtPath(artist?.artistArt);
      if (art) {
        artistArt = Buffer.from(art).toString("base64");
      }
    }
    if (artist) {
      res.status(200).json({ status: "OK", data: { ...artist, artistArt } });
    } else {
      res.status(404).json({ status: "ERROR", message: "Artist not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getByIds = async (req: Request, res: Response) => {
  const requestSchema = Joi.object({
    artistIds: Joi.array().items(Joi.string().required()).required(),
  });
  const { error } = requestSchema.validate(req.body);
  if (error) {
    res.status(400).json({ status: "ERROR", message: error.message });
    return;
  }
  try {
    const artistIds: string[] = req.body.artistIds;
    if (!artistIds || !Array.isArray(artistIds) || artistIds.length === 0) {
      res
        .status(400)
        .json({ status: "ERROR", message: "Artist IDs are required" });
      return;
    }
    const artists = await getArtistsByIds(artistIds);
    res.status(200).json({ status: "OK", data: artists });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getBySlug = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  if (!slug) {
    return res
      .status(400)
      .json({ status: "ERROR", message: "Artist slug is required" });
  }

  const returnArtistArt = req.query.includeArt === "true";
  try {
    const artist = await getArtistBySlug(slug);
    let artistArt = null;
    if (artist && returnArtistArt && artist.artistArt) {
      const art = await getImageAtPath(artist?.artistArt);
      if (art) {
        artistArt = Buffer.from(art).toString("base64");
      }
    }
    if (artist) {
      res.status(200).json({ status: "OK", data: { ...artist, artistArt } });
    } else {
      res.status(404).json({ status: "ERROR", message: "Artist not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getRandom = async (req: Request, res: Response) => {
  const excludeArtists: string[] = req.query.exclude
    ? ((Array.isArray(req.query.exclude)
        ? req.query.exclude
        : [req.query.exclude]) as string[])
    : [];
  const count = 5;
  try {
    const artists = await getRandomArtists(count, excludeArtists);
    res.status(200).json({ status: "OK", data: artists });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getNewest = async (req: Request, res: Response) => {
  const count = 4;
  try {
    const artists = await getNewestArtistsAction(count);
    res.status(200).json({ status: "OK", data: artists });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getSimilarArtists = async (req: Request, res: Response) => {
  const artistId = req.params.id;
  if (!artistId) {
    res.status(400).json({ status: "ERROR", message: "Artist ID is required" });
    return;
  }
  const count = 5;
  try {
    const similarArtists = await getSimilarArtistsAction(artistId, count);
    res.status(200).json({ status: "OK", data: similarArtists });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const setFavorite = async (req: Request, res: Response) => {
  if (!req.user) {
    res
      .status(401)
      .json({ status: "ERROR", message: "User not authenticated" });
    return;
  }
  const artistId = req.params.id;
  if (!artistId) {
    res.status(400).json({ status: "ERROR", message: "Artist ID is required" });
    return;
  }
  const requestSchema = Joi.object({
    remove: Joi.boolean().required(),
  });
  const { error } = requestSchema.validate(req.body);
  if (error) {
    res.status(400).json({ status: "ERROR", message: error.message });
    return;
  }

  const { remove } = req.body;
  try {
    let data;
    if (remove) {
      data = await removeFavoriteArtist(req.user._id, artistId);
    } else {
      data = await addFavoriteArtist(req.user._id, artistId);
    }
    res
      .status(200)
      .json({ status: "OK", message: "Favorite updated successfully", data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const updateArtist = async (req: Request, res: Response) => {
  if (!req.params.id) {
    res.status(400).json({ status: "ERROR", message: "Artist ID is required" });
    return;
  }
  const validatedFields = await artistFormValidators.editArtistSchema.validate({
    artistName: req.body.name,
    ...req.body,
  });

  await updateArtistAction(
    req.user._id,
    req.params.id,
    validatedFields,
    req.file,
  );
  logServerEvent(
    createArtistProfileUpdatedEvent(req.params.id, req.user._id.toString()),
  );
  res
    .status(200)
    .json({ status: "OK", message: "Artist updated successfully" });
};

export const deleteArtist = async (req: Request, res: Response) => {
  if (!req.user) {
    res
      .status(401)
      .json({ status: "ERROR", message: "User not authenticated" });
    return;
  }
  if (!req.params.id) {
    res.status(400).json({ status: "ERROR", message: "Artist ID is required" });
    return;
  }
  const result = await deleteArtistAction(req.user._id, req.params.id);
  logServerEvent(
    createArtistProfileDeletedEvent(req.params.id, req.user._id.toString()),
  );
  res
    .status(200)
    .json({ status: "OK", message: "Artist deleted successfully" });
};
