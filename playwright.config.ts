import { defineConfig } from "@playwright/test";
import { config } from "dotenv";

config();

export default defineConfig({
  projects: [
    { name: "setup", testMatch: /coverage.setup.ts/ },
    {
      name: "api-checks",
      dependencies: ["setup"],
    },
  ],

  use: {
    extraHTTPHeaders: {
      "playwright-solutions": "true",
    },
    baseURL: process.env.URL,
    ignoreHTTPSErrors: true,
    trace: "on",
  },
  retries: 0,
  reporter: [["list"], ["html"]],
});
