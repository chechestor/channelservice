import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const pagesBase = process.env.GITHUB_ACTIONS ? "/channelservice/" : "/";

export default defineConfig({
  plugins: [react()],
  base: pagesBase,
});
