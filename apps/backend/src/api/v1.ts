import express from "express";
import passport from "passport";
import { ensureLoggedIn } from "connect-ensure-login";
import { healthCheck } from "../controllers/health";
import {
  checkAuth,
  login,
  logout,
  resendVerification,
  signUp,
  verifyEmail,
} from "../controllers/auth";
import {
  createNewArtist,
  deleteArtist,
  getArtists,
  getById,
  getRandom,
  getNewest as getNewestArtists,
  getSimilarArtists,
  updateArtist,
  setFavorite as setFavoriteArtist,
  getBySlug,
} from "../controllers/artist";
import {
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAlbums,
  updateAlbum,
} from "../controllers/album";

import {
  deleteTrack,
  getBySlugAndArtist,
  getRandom as getRandomTracks,
  getNewest as getNewestTracks,
  getSimilarTracks,
  getTrack,
  getTracks,
  getTracksByArtistId,
  setFavorite,
  submitTrack,
  updateTrack,
} from "../controllers/track";
import {
  getFavorites,
  getManagedArtists,
  deleteUser,
} from "../controllers/user";
import isLoggedIn from "../middleware/isLoggedIn";
import isAdmin from "../middleware/isAdmin";
import { resendVerificationIpLimiter } from "../middleware/resendVerificationLimiter";
import Multer from "multer";
import { getGenres } from "../controllers/genre";
import checkUserAccountStatus from "../middleware/checkUserAccountStatus";
import {
  listEditorialProfiles,
  getEditorialProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  convertProfile,
} from "../controllers/admin/editorial";
import { listUsers, updateUserStatus } from "../controllers/admin/users";
import { claimProfile } from "../controllers/editorialClaim";
import {
  getBySlug as getEditorialBySlug,
  setFavorite as setFavoriteEditorial,
} from "../controllers/editorial";

const upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const router = express.Router();

// Health Check Endpoint
router.route("/health").get(healthCheck);
router.route("/genre").get(getGenres);

// Authentication Endpoints
router.route("/auth/check-auth").get(checkAuth);
router.route("/auth/sign-up").post(signUp);
router
  .route("/auth/log-in")
  .post(
    passport.authenticate("local", { session: true }),
    checkUserAccountStatus,
    login,
  );
router.route("/auth/log-out").get(ensureLoggedIn(), logout);
router.route("/auth/verify-email/:token").get(verifyEmail);
router
  .route("/auth/resend-verification")
  .post(resendVerificationIpLimiter, resendVerification);

// Artist Endpoints
router
  .route("/artists")
  .get(getArtists)
  .post(isLoggedIn, upload.single("artistArt"), createNewArtist);
router.route("/artists/random").get(getRandom);
router.route("/artists/newest").get(getNewestArtists);
router
  .route("/artists/:id")
  .get(getById)
  .put(
    isLoggedIn,
    checkUserAccountStatus,
    upload.single("artistArt"),
    updateArtist,
  )
  .delete(isLoggedIn, checkUserAccountStatus, deleteArtist);
router.route("/artist/:id/favorite").post(isLoggedIn, setFavoriteArtist);
router.route("/artist/:id/similar").get(getSimilarArtists);
router.route("/artist/slug/:slug").get(getBySlug);
// Album Endpoints
router
  .route("/albums")
  .get(getAlbums)
  .post(isLoggedIn, upload.single("albumArt"), createAlbum);
router
  .route("/albums/:id")
  .get(getAlbumById)
  .put(ensureLoggedIn(), upload.single("albumArt"), updateAlbum)
  .delete(ensureLoggedIn(), deleteAlbum);

// Track Endpoints
router
  .route("/tracks")
  .post(isLoggedIn, upload.single("trackArt"), submitTrack);
router.route("/tracks/random").get(getRandomTracks);
router.route("/tracks/newest").get(getNewestTracks);
router
  .route("/track/slug/:trackSlug/artist/:artistSlug")
  .get(getBySlugAndArtist);

router
  .route("/tracks/:trackId")
  .get(getTrack)
  .put(isLoggedIn, upload.single("trackArt"), updateTrack)
  .delete(isLoggedIn, deleteTrack);
router.route("/tracks/:trackId/favorite").post(isLoggedIn, setFavorite);
router.route("/tracks/:trackId/similar").get(getSimilarTracks);
router.route("/tracks/genre/:genre").get(getTracks);
router.route("/tracks/artist/:artistId").get(getTracksByArtistId);

// User Endpoints
router.route("/user/favorites").get(isLoggedIn, getFavorites);
router.route("/user/:userId").delete(isLoggedIn, deleteUser);
router
  .route("/users/:userId/managed-artists")
  .get(isLoggedIn, getManagedArtists);

// Editorial (public-facing)
router.route("/editorial/slug/:slug").get(getEditorialBySlug);
router.route("/editorial/:id/favorite").post(isLoggedIn, setFavoriteEditorial);
router
  .route("/editorial/:id/claim")
  .post(isLoggedIn, checkUserAccountStatus, claimProfile);

// Admin Endpoints (isAdmin guard applied to all)
router
  .route("/admin/editorial")
  .get(isLoggedIn, isAdmin, listEditorialProfiles)
  .post(isLoggedIn, isAdmin, createProfile);
router
  .route("/admin/editorial/:id")
  .get(isLoggedIn, isAdmin, getEditorialProfile)
  .patch(isLoggedIn, isAdmin, updateProfile)
  .delete(isLoggedIn, isAdmin, deleteProfile);
router
  .route("/admin/editorial/:id/convert")
  .post(isLoggedIn, isAdmin, convertProfile);

router.route("/admin/users").get(isLoggedIn, isAdmin, listUsers);
router
  .route("/admin/users/:userId/status")
  .patch(isLoggedIn, isAdmin, updateUserStatus);

export default router;
