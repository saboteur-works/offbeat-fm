import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  userId: null,
  email: null,
  role: null as "user" | "admin" | null,
  loggedIn: false,
  favoriteTracks: [] as string[],
  favoriteArtists: [] as string[],
  favoriteAlbums: [] as string[],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser(state, action) {
      state.username = action.payload.username;
      state.loggedIn = true;
      state.userId = action.payload._id;
      state.role = action.payload.role ?? "user";
      state.favoriteTracks = action.payload.favoriteTracks || [];
      state.email = action.payload.email;
      state.favoriteArtists = action.payload.favoriteArtists || [];
      state.favoriteAlbums = action.payload.favoriteAlbums || [];
    },
    unsetUser(state) {
      state.username = null;
      state.loggedIn = false;
      state.userId = null;
      state.role = null;
      state.favoriteTracks = [];
      state.email = null;
      state.favoriteArtists = [];
      state.favoriteAlbums = [];
    },
    setFavoriteTracks(state, action) {
      state.favoriteTracks = action.payload;
    },
    setFavoriteArtists(state, action) {
      state.favoriteArtists = action.payload;
    },
    setFavoriteAlbums(state, action) {
      state.favoriteAlbums = action.payload;
    },
  },
});

export const {
  setUser,
  unsetUser,
  setFavoriteTracks,
  setFavoriteArtists,
  setFavoriteAlbums,
} = usersSlice.actions;

export default usersSlice.reducer;
