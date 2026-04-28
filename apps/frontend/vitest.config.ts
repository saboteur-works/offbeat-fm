import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    testEnvironmentOptions: {
      url: "http://localhost",
    },
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@/fonts": path.resolve(__dirname, "./styles/fonts.ts"),
    },
  },
});
