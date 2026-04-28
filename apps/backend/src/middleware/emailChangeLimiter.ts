import { rateLimit } from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import { redisClient } from "../lib/redis";

export const emailChangeIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

export const emailChangeUserRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!redisClient) return next();
  try {
    const key = `rl:email-change-req:${req.user._id.toString()}`;
    const count = await redisClient.incr(key);
    if (count === 1) await redisClient.expire(key, 3600);
    if (count > 3) {
      return res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    }
  } catch (err) {
    console.error("Redis email change rate limit check failed:", err);
  }
  return next();
};
