import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { simpleFederationHostPlugin } from "simple-module-federation";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    simpleFederationHostPlugin({
      sharedModules: {
        react: "default",
        "react-dom": "default",
        "react/jsx-runtime": "*",
        "react-router-dom": ["Link"],
      },
    }),
    visualizer({ open: true }),
  ],
  server: {
    cors: true,
    port: 3000,
  },
  preview: { port: 3000 },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react/jsx-runtime", "react-dom"],
          vendor: ["react-router-dom"],
        },
      },
    },
  },
});
