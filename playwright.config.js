// @ts-check
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Chargement des variables d'environnement depuis .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    // Base URL depuis .env
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    // Screenshot automatique uniquement sur échec
    screenshot: "only-on-failure",

    // Vidéo automatique uniquement sur échec
    video: "retain-on-failure",

    // Collecte trace pour visualiser les tests
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },*/
  ],
});
