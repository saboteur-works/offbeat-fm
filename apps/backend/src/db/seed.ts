// This file is responsible for creating initial seed data in the database for the purpose of development.
// It should not be used in production environments.
import User from "./models/User";
import Artist from "./models/Artist";
import Track from "./models/Track";
import { genres } from "../jsonData/genres.json";
const userCount = 50;

const pickRandomGenre = () => {
  return genres[Math.floor(Math.random() * genres.length)]; // eslint-disable-line sonarjs/pseudo-random
};

export const seedDatabase = async () => {
  const Chance = await import("chance").then((mod) => mod.Chance);
  const chance = new Chance();

  const usersData = [];
  for (let i = 0; i < userCount; i++) {
    const user = new User({
      username: chance.word(),
      email: chance.email(),
      password: "testpassword", // eslint-disable-line sonarjs/no-hardcoded-passwords
    });
    usersData.push(user);
  }
  const testUser = new User({
    username: "testuser",
    email: "test@example.comm",
    password: "testpassword", // eslint-disable-line sonarjs/no-hardcoded-passwords
    accountStatus: "active",
    role: "admin",
  });
  usersData.push(testUser);

  const users = await User.insertMany(usersData);

  const artistsData = [];
  for (const user of users) {
    const artist = new Artist({
      name: chance.name({ full: true }),
      genre: pickRandomGenre()?.toLowerCase(),
      managingUserId: user._id,
      biography: chance.paragraph(),
      links: {
        facebook: "https://facebook.com/" + chance.string({ length: 10 }),
        twitter: "https://twitter.com/" + chance.string({ length: 10 }),
        instagram: "https://instagram.com/" + chance.string({ length: 10 }),
      },
    });
    artistsData.push(artist);
  }
  const artists = await Artist.insertMany(artistsData);

  const tracksData = [];
  for (const artist of artists) {
    const track = new Track({
      title: chance.sentence({ words: 3, punctuation: false }),
      duration: chance.integer({ min: 60, max: 300 }),
      artistId: artist._id,
      managingUserId: artist.managingUserId,
      genre: artist.genre,
      links: {
        spotify:
          "https://open.spotify.com/track/" + chance.string({ length: 10 }),
        appleMusic:
          "https://music.apple.com/us/album/" + chance.string({ length: 10 }),
        soundcloud: "https://soundcloud.com/" + chance.string({ length: 10 }),
      },
    });
    tracksData.push(track);
  }
  await Track.insertMany(tracksData);

  console.log("Database seeded with initial data");
};
