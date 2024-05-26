import { defineConfig } from "vite";
import typescript from "rollup-plugin-typescript2";
import dts from "vite-plugin-dts";
import { simpleFederationRemotePlugin } from "simple-module-federation";
import pkg from "./package.json";
import { resolve } from "path";

const inputs = Object.keys(pkg.exports).reduce((prev, key) => {
  const out = pkg.exports[key]
    .replace(".js", ".tsx")
    .replace("./dist", "./src");
  prev[key.replace("./", "")] = resolve(__dirname, out);
  return prev;
}, {});

const externals = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react-router-dom",
  "shared/config",
];

export default defineConfig({
  plugins: [dts()],
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
      fileName: (format, alias) => `${alias}.js`,
    },
    minify: true,
    sourcemap: true,
    rollupOptions: {
      plugins: [
        simpleFederationRemotePlugin({
          sharedDependencies: externals,
        }),
      ],
      input: inputs,
      output: {
        format: "es",
        exports: "named",
        dir: "dist",
        entryFileNames: "[name].js",
      },
      external: externals,
    },
  },
});
