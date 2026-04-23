import { Request, Response } from "express";
import { IUserDoc } from "../../db/models/User";
import {
  createEditorialProfile,
  deleteEditorialProfile,
  getEditorialProfileById,
  getEditorialProfiles,
  updateEditorialProfile,
} from "../../db/actions/EditorialProfile";

export const listEditorialProfiles = async (_req: Request, res: Response) => {
  try {
    const profiles = await getEditorialProfiles();
    return res.status(200).json({ data: profiles });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getEditorialProfile = async (req: Request, res: Response) => {
  try {
    const profile = await getEditorialProfileById(req.params["id"] ?? "");
    if (!profile) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ data: profile });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createProfile = async (req: Request, res: Response) => {
  try {
    const admin = req.user as IUserDoc;
    const { name, genre, biography, editorialNotes } = req.body as {
      name?: string;
      genre?: string;
      biography?: string;
      editorialNotes?: string;
    };
    if (!name || !genre) {
      return res.status(400).json({ message: "name and genre are required" });
    }
    const profile = await createEditorialProfile(admin._id.toString(), {
      name,
      genre,
      biography,
      editorialNotes,
    });
    return res.status(201).json({ data: profile });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, genre, biography, editorialNotes, verificationStatus } =
      req.body as {
        name?: string;
        genre?: string;
        biography?: string;
        editorialNotes?: string;
        verificationStatus?: "unverified" | "pending" | "verified";
      };
    const updated = await updateEditorialProfile(req.params["id"] ?? "", {
      name,
      genre,
      biography,
      editorialNotes,
      verificationStatus,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ data: updated });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteEditorialProfile(req.params["id"] ?? "");
    if (!deleted) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "Deleted" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};
