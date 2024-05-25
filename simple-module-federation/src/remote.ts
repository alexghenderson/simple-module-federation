import { Plugin, TransformResult, normalizePath } from "vite";

export interface SimpleFederationRemotePluginArgs {
  // Prefix for shared module accessors on global object
  moduleIdPrefix?: string;
  // Shared dependencies to resolve from global object
  sharedDependencies: Array<string>;
}

/**
 * Create a Vite plugin to resolve specified plugins via the global object
 * Transforms `import React from 'react'` into `const React = window["react"]`
 */
export function simpleFederationRemotePlugin(
  args: SimpleFederationRemotePluginArgs,
): Plugin {
  const { moduleIdPrefix = "__SHARED_", sharedDependencies } = args;

  return {
    name: "vite-plugin-simple-module-federation-remote",
    apply: "build",
    async transform(code): Promise<TransformResult | null> {
      for (const dependency of sharedDependencies) {
        const resolvedName = `window["${moduleIdPrefix}${dependency}"]`;
        [
          `import ({[^{}]*}) from "${dependency}"`,
          `import \w+ from "${dependency}"`,
        ].forEach((pattern) => {
          const expr = new RegExp(pattern, "g");
          if (expr.test(code)) {
            code = code.replace(expr, `const $1 = ${resolvedName}`);
          }
        });
      }
      return { code, map: null };
    },
  };
}

export default simpleFederationRemotePlugin;
