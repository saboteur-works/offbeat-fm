import { Request, Response } from "express";
import { IUserDoc } from "../db/models/User";
import {
  addFavoriteEditorialProfile,
  getEditorialProfileBySlug,
  removeFavoriteEditorialProfile,
} from "../db/actions/EditorialProfile";
import { getImageAtPath } from "../db/actions/Storage";

export const getBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (!slug) {
    return res.status(400).json({ message: "Slug is required" });
  }
  const returnArt = req.query.includeArt === "true";
  try {
    const profile = await getEditorialProfileBySlug(slug);
    if (!profile) return res.status(404).json({ message: "Not found" });

    let artistArt: string | null = null;
    if (returnArt && profile.artistArt) {
      const art = await getImageAtPath(profile.artistArt);
      if (art) artistArt = Buffer.from(art).toString("base64");
    }

    const {
      editorialNotes: _editorialNotes,
      createdByAdminId: _createdByAdminId,
      ...publicData
    } = profile.toJSON({ flattenMaps: true });

    return res.status(200).json({ data: { ...publicData, artistArt } });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const setFavorite = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { remove } = req.body as { remove?: boolean };
  const user = req.user as IUserDoc;
  try {
    const updated = remove
      ? await removeFavoriteEditorialProfile(id ?? "", user.username)
      : await addFavoriteEditorialProfile(id ?? "", user.username);
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ data: updated.favoritedBy });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};
