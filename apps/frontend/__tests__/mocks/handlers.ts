import { http, HttpResponse } from "msw";
import type { IArtist, ITrack, IUser } from "@common/types/src/types";

const BASE = "http://localhost/api/v1";

export const mockUser: IUser & { _id: string } = {
  _id: "user-123",
  username: "testuser",
  email: "test@example.com",
  password: "hashed",
  accountStatus: "active",
  role: "user",
  favoriteTracks: [],
  favoriteAlbums: [],
  favoriteArtists: [],
};

export const mockArtist: IArtist & { _id: string } = {
  _id: "artist-123",
  name: "Test Artist",
  slug: "test-artist",
  genre: "Rock",
  managingUserId: "user-123",
  albums: [],
  tracks: [],
};

export const mockTrack: ITrack & { _id: string } = {
  _id: "track-123",
  title: "Test Track",
  slug: "test-track",
  artistId: "artist-123",
  albumId: "album-123",
  genre: "Rock",
  managingUserId: "user-123",
};

export const handlers = [
  // Auth — default check-auth returns 401; individual tests override for auth-gated pages.
  http.get(`${BASE}/auth/check-auth`, () => new HttpResponse(null, { status: 401 })),

  http.post(`${BASE}/auth/log-in`, () => HttpResponse.json({ user: mockUser })),

  http.post(`${BASE}/auth/sign-up`, () => HttpResponse.json({}, { status: 201 })),

  // Artists
  http.post(`${BASE}/artists`, () =>
    HttpResponse.json({ artist: mockArtist }, { status: 201 }),
  ),

  http.get(`${BASE}/artists/:id`, () => HttpResponse.json({ data: mockArtist })),

  // Tracks
  http.post(`${BASE}/tracks`, () =>
    HttpResponse.json({ track: mockTrack }, { status: 201 }),
  ),

  // Genres (SWR key "genre" → axiosInstance.get("/genre") → /api/v1/genre)
  http.get(`${BASE}/genre`, () =>
    HttpResponse.json({ genres: ["Electronic", "Hip-Hop", "Jazz", "Pop", "Rock"] }),
  ),

  // User settings
  http.post(`${BASE}/user/re-auth`, () => HttpResponse.json({})),

  http.post(`${BASE}/user/email/change`, () => HttpResponse.json({})),

  http.patch(`${BASE}/user/username`, () => HttpResponse.json({})),

  http.patch(`${BASE}/user/password`, () => HttpResponse.json({})),
];
