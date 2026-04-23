import { Request, Response, NextFunction } from "express";
import { IUserDoc } from "../db/models/User";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUserDoc | undefined;
  if (req.isAuthenticated() && user?.role === "admin") {
    return next();
  }
  res.status(403).json({ result: 0, message: "Forbidden." });
};

export default isAdmin;
