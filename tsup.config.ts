import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["./src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    minify: "terser",
    target: "es2020",
    treeshake: true,
    splitting: false,
    bundle: true,
    esbuildOptions(options) {
      options.drop = ["debugger"];
    },
  },
  {
    entry: ["./src/cli.ts"],
    format: ["esm"],
    dts: false,
    clean: false,
    minify: "terser",
    target: "es2020",
    treeshake: true,
    splitting: false,
    bundle: true,
    outDir: "dist",
    outExtension() {
      return {
        js: `.js`,
      };
    },
    banner: {
      js: "#!/usr/bin/env node",
    },
    esbuildOptions(options) {
      options.drop = ["debugger"];
    },
  },
]);
