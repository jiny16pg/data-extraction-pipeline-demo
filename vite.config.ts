import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base keeps the build portable for GitHub Pages project sites
// (served from https://<user>.github.io/<repo>/) without hardcoding the repo name.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
