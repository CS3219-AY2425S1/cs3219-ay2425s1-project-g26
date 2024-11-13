import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
    port: 5173,
    watch: {
      usePolling: true,
    },
    hmr: {
      port: 5173,
      clientPort: 5173,
      host: "localhost",
    },
  },
});
