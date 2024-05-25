import { defineConfig } from "vite";
import { simpleFederationRemotePlugin } from "simple-module-federation";

export default defineConfig({
  plugins: [],
  server: {
    port: 5001,
  },
  preview: {
    port: 5001,
  },
  build: {
    lib: {
      entry: { config: "src/config.tsx" },
      name: "Remote",
      formats: ["es"],
      fileName: (format, alias) => `${alias}.${format}.js`,
    },
    minify: true,
    sourcemap: true,
    rollupOptions: {
      plugins: [],
      external: ["react", "react/jsx-runtime", "react-dom"],
    },
  },
});
