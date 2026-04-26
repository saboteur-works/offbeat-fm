import { Request, Response } from "express";
import User from "../../db/models/User";

export const listUsers = async (req: Request, res: Response) => {
  try {
    const search = (req.query["search"] as string) ?? "";
    const query = search
      ? { $or: [{ username: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] }
      : {};
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(100);
    return res.status(200).json({ data: users });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body as {
      status?: "pending" | "active" | "inactive" | "banned";
    };
    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }
    const user = await User.findByIdAndUpdate(
      req.params["userId"],
      { accountStatus: status },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ data: user });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};
