const { resolve } = require("path");
const { defineConfig } = require("rollup");
const typescript = require("rollup-plugin-typescript2");

module.exports = defineConfig({
  plugins: [typescript()],
  input: {
    host: resolve(__dirname, "src/host.ts"),
    remote: resolve(__dirname, "src/remote.ts"),
    index: resolve(__dirname, "src/index.ts"),
  },
  output: {
    format: "es",
    exports: "named",
    dir: "dist",
    entryFileNames: "[name].js",
  },
});
