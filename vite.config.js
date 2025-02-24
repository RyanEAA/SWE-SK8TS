import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Set the dev server port to 3000
    host: true   // Ensure it binds correctly inside the container
  },
  build: {
    target: 'esnext', // more modern target
  }
});

