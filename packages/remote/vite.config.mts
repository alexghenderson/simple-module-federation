import { defineConfig } from "vite";
import { simpleFederationRemotePlugin } from "simple-module-federation";

const externals = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react-router-dom",
  "shared/config",
];

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
      entry: { Test: "src/Test.tsx" },
      name: "Remote",
      formats: ["es"],
      fileName: (format) => `Test.${format}.js`,
    },
    minify: true,
    sourcemap: true,
    rollupOptions: {
      plugins: [
        simpleFederationRemotePlugin({
          sharedDependencies: externals,
        }),
      ],
      external: externals,
    },
  },
});