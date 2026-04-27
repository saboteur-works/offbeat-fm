import { Request, Response, NextFunction } from "express";

const checkSessionVersion = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.isAuthenticated()) return next();

  const sessionVersion = req.session.sessionVersion ?? 0;
  const userVersion = req.user.sessionVersion ?? 0;

  if (sessionVersion !== userVersion) {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(401).json({ message: "Session expired. Please log in again." });
    });
    return;
  }

  next();
};

export default checkSessionVersion;
