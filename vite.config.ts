import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub Pages: project repos use /<repo>/; user/org site repo <name>.github.io uses "/". */
const repoSegment = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGithubUserSiteRepo = Boolean(repoSegment?.endsWith(".github.io"));
const base =
  process.env.GITHUB_PAGES === "true" && repoSegment && !isGithubUserSiteRepo
    ? `/${repoSegment}/`
    : "/";

export default defineConfig({
  base,
  plugins: [react()]
});
