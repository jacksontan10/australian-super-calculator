import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub Pages project URLs are /<repo>/; set GITHUB_PAGES=true in CI (see workflow). */
const repoSegment = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base =
  process.env.GITHUB_PAGES === "true" && repoSegment ? `/${repoSegment}/` : "/";

export default defineConfig({
  base,
  plugins: [react()]
});
