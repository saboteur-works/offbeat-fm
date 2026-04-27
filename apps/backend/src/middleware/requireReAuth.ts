import { Request, Response, NextFunction } from "express";

const RE_AUTH_WINDOW_MS = 10 * 60 * 1000;

const requireReAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.reAuthAt) {
    return res
      .status(401)
      .json({ message: "Password confirmation required.", code: "RE_AUTH_REQUIRED" });
  }
  if (Date.now() - req.session.reAuthAt > RE_AUTH_WINDOW_MS) {
    return res
      .status(401)
      .json({ message: "Re-authentication expired. Please confirm your password again.", code: "RE_AUTH_EXPIRED" });
  }
  return next();
};

export default requireReAuth;
