const { resolve } = require("path");
const { defineConfig } = require("rollup");
const typescript = require("rollup-plugin-typescript2");
const pkg = require("./package.json");

const inputs = Object.keys(pkg.exports).reduce((prev, key) => {
  const out = pkg.exports[key]
    .replace(".js", ".tsx")
    .replace("./dist", "./src");
  prev[key.replace("./", "")] = resolve(__dirname, out);
  return prev;
}, {});

module.exports = defineConfig({
  plugins: [typescript()],
  input: inputs,
  output: {
    format: "es",
    exports: "named",
    dir: "dist",
    entryFileNames: "[name].js",
  },
  external: ["react", "react/jsx-runtime"],
});
