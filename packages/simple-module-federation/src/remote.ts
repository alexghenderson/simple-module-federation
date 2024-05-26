import { type Plugin, type TransformResult, normalizePath } from "vite";

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
			let modifiedCode = code;
			for (const dependency of sharedDependencies) {
				const resolvedName = `window["${moduleIdPrefix}${dependency}"]`;
				for (const pattern of [
					`import ({[^{}]*}) from "${dependency}"`,
					`import \w+ from "${dependency}"`,
				]) {
					const expr = new RegExp(pattern, "g");
					if (expr.test(code)) {
						modifiedCode = code.replace(expr, `const $1 = ${resolvedName}`);
					}
				}
			}
			return { code: modifiedCode, map: null };
		},
	};
}

export default simpleFederationRemotePlugin;
