import type { Plugin } from "vite";

export interface SharedModule {
	imports: Array<string> | "default" | "*";
}

function generateSharedImport(
	moduleName: string,
	importRule: Array<string> | "default" | "*",
	sharedModulePrefix: string,
) {
	const namespace = "window";
	const name = `${namespace}["${sharedModulePrefix}${moduleName}"]`;
	const imports = Array.isArray(importRule)
		? `{ ${importRule.join(", ")}}`
		: importRule === "default"
			? "M"
			: "* as M";
	const value = Array.isArray(importRule) ? imports : "M";
	return `import ${imports} from "${moduleName}"; ${name} = ${value};`;
}

export interface ModuleHostPluginArgs {
	moduleIdPrefix?: string;
	sharedModules: Record<string, Array<string> | "default" | "*">;
}

/**
 * Create a plugin to configure a remote module host.
 */
export function simpleFederationHostPlugin(args: ModuleHostPluginArgs): Plugin {
	const { sharedModules = {}, moduleIdPrefix = "__SHARED_" } = args;
	const sharedModuleIds = Object.keys(sharedModules);

	const virtualModuleIds = sharedModuleIds.map((key) => `/virtual:${key}`);
	const resolvedVirtualModuleIds = virtualModuleIds.map((id) => `\0${id}`);

	return {
		name: "vite-plugin-simple-federation-host",
		resolveId(id) {
			console.log(id);
			const virtual = virtualModuleIds.find((v) => id.endsWith(v));
			if (virtual) {
				console.log("is virtual");
				return `\0${virtual}`;
			}
		},
		load(id) {
			if (resolvedVirtualModuleIds.includes(id)) {
				console.log(`loading virtual ${id}`);
				const actual = id.split("virtual:")[1];
				const importRule = sharedModules[actual];
				if (importRule) {
					const value = generateSharedImport(
						actual,
						importRule,
						moduleIdPrefix,
					);
					return value;
				}
			}
		},
		transformIndexHtml: {
			order: "pre",
			handler(html) {
				const scripts = virtualModuleIds.map(
					(id) => `<script src=".${id}" type="module"></script>`,
				);
				return html.replace("</body>", `${scripts.join("")}</body>`);
			},
		},
	};
}

export default simpleFederationHostPlugin;
