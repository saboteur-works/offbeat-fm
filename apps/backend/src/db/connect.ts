import mongoose from "mongoose";
import { seedDatabase } from "./seed";
import User from "./models/User";
import { readFileSync } from "fs";

export const connectToDatabase = async () => {
  if (process.env.NODE_ENV === "test") {
    try {
      const host = process.env.LOCAL_TEST ? "localhost" : "mongo";
      console.log(host);
      await mongoose.connect(
        `mongodb://${host}:27017/music-discovery-app-test`,
      );
      await mongoose.connection.db?.admin().command({ ping: 1 });
    } catch (error) {
      console.error("Error connecting to the test database:", error);
      throw error; // Re-throw the error after logging it
    }

    return;
  }
  if (process.env.NODE_ENV === "development") {
    try {
      await mongoose.connect(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      );
      if (mongoose.connection.db) {
        if ((await User.countDocuments({})) > 0) {
          console.log("Database already seeded");
          return;
        }
        await mongoose.connection.db.dropDatabase();
        console.log("Dropped existing database for development environment");
        await seedDatabase();
      }
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw error; // Re-throw the error after logging it
    }
  }

  if (process.env.NODE_ENV === "production") {
    try {
      const dbUser =
        process.env.DB_USER ||
        readFileSync("/run/secrets/DB_USER", "utf-8").trim();
      const dbpassword =
        process.env.DB_PASSWORD ||
        readFileSync("/run/secrets/DB_PASSWORD", "utf-8").trim();
      await mongoose.connect(
        `mongodb+srv://${dbUser}:${dbpassword}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=mda-alpha`,
        {
          serverApi: {
            version: "1",
            strict: true,
            deprecationErrors: true,
          },
          dbName: process.env.DB_NAME,
        },
      );
      await mongoose.connection.db?.admin().command({ ping: 1 });
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw error; // Re-throw the error after logging it
    }
  }
};
