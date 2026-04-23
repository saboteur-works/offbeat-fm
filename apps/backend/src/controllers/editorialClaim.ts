import { Request, Response } from "express";
import { claimEditorialProfile } from "../db/actions/EditorialProfile";
import { IUserDoc } from "../db/models/User";

export const claimProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUserDoc;
    const profile = await claimEditorialProfile(
      req.params["id"] ?? "",
      user._id.toString(),
    );
    return res.status(200).json({ data: profile });
  } catch (error) {
    if (error instanceof Error && error.message.includes("already been claimed")) {
      return res.status(409).json({ message: error.message });
    }
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
