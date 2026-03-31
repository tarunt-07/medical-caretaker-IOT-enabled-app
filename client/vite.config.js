import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    // Default to root for Vercel and allow overrides for subpath deployments.
    base: env.VITE_PUBLIC_BASE || "/",
    build: {
      outDir: "dist",
    },
  };
});
