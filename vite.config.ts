import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "http://172.16.188.214:8443",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
});
