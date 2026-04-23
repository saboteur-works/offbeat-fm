import cors from "cors";
import express from "express";
import passport from "passport";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import expressSession, { MemoryStore } from "express-session";
import { connectToDatabase } from "./db";
import { Strategy as LocalStrategy } from "passport-local";
import User, { IUserDoc } from "./db/models/User";
import api from "./api/v1";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import { readFileSync } from "fs";
let redisClient;
let redisStore;

if (process.env.NODE_ENV === "production") {
  redisClient = createClient({
    username:
      process.env.REDIS_USERNAME ||
      readFileSync("/run/secrets/REDIS_USERNAME", "utf-8").trim(),
    password:
      process.env.REDIS_PASSWORD ||
      readFileSync("/run/secrets/REDIS_PASSWORD", "utf-8").trim(),
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    },
  });
  redisClient.connect().catch(console.error);
  redisClient.on("connect", () => {
    console.log("Connected to redis");
  });
  redisClient.on("ready", () => {
    console.log("Redis connection is ready");
  });
  redisStore = new RedisStore({
    client: redisClient,
    prefix: "mda:",
  });
}

const appName = "OffBeat";
const limiter = rateLimit({
  windowMs: 10000, // 10 seconds
  limit: 30, // each IP can make up to 30 requests per `windowsMs` (10 seconds)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
});
const app = express();

app.use(helmet());
const allowedOrigins = (
  process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:3000"
)
  .split(",")
  .map((u) => u.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  }),
);
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}
app.use(limiter);
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.urlencoded({ extended: true }));
if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
}
app.use(
  expressSession({
    store:
      process.env.NODE_ENV === "production" ? redisStore : new MemoryStore({}),
    secret:
      process.env.SESSION_SECRET || readFileSync("/run/secrets/SESSION_SECRET"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      // COOKIE_DOMAIN should be ".offbeat-fm.com" in production (leading dot
      // makes the cookie valid for all subdomains including admin.offbeat-fm.com)
      domain: process.env.COOKIE_DOMAIN,
    },
  }),
);

connectToDatabase();
passport.use(
  new LocalStrategy(async function (username, password, done) {
    const user = await User.findOne({ username: username });

    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }
    if (!user.checkPassword(password)) {
      return done(null, false, { message: "Incorrect password." });
    }
    return done(null, user);
  }),
);

passport.serializeUser(function (user: IUserDoc, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await User.findById(id);
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/v1", api);

app.listen(process.env.PORT, () => {
  console.log(`${appName} is running on port ${process.env.PORT}`);
});
