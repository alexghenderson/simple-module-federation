# Simple Module Federation

This is an experimental federation module plugin system. It's not properly tested, likely has bugs, a number of limitations, and is not intended for production use.

This system allows you to import modules that are built and deployed as part of another package, dynamically over http - even across domains. It does so in a way that allows re-use of existing dependencies, as needed. Whe paired with native browser `import` statements, it provides a module-federation like experience, even if missing a number of features.

It works via two plugins:

## Host Plugin

The host plugin works by accepting a list of shared dependencies and exposing those dependencies automatically through the global window object. It allows specifying exact exports to be shared, or can share the default export, or even all the exports.

It works by injecting a number of virtual scripts into the document, each of which imports all exports that are specified to be shared, and attaches it to the global object, making it available to remote modules built with the remote plugin.

## Remote Plugin

The remote plug works by accepted a list of shared dependencies, and remapping the imports to access the modules through the global window object. When matched up with the shared dependencies passed into the host plugin, and with proper externals specified in the remote module rollup config, it allows usage of these shared modules.

# Limitations

This plugin currently generates code that utilizes ES modules which can be loaded via built-in dynamic `import` statements. This imposes some limitations:

- Type information is not automatically included in remote modules. It is likely possible to get types working with these modules, but it would require some work. Due to this, imported modules are effectively typed as `any`.
- It is not possible for the host to directly share code with remotes. This can be worked around by moving shared code into a dependency, and adding it to the shared module configuration in the host and remote plugin configuration. This in action is included in the example project (the `shared/config` module).
- This relies entirely on native ES modules, which may not be supported by all browsers. It has been tested on chrome-based browsers, and likely will work in other browsers (anything from 2018 on according to caniuse).
- This implementation lacks many features that are included in the larger module-federation packages.

# Benefits

The simplicity of these plugins means it is very easy to set up, and the configuration is very easy to maintain. Furthermore, although this package includes vite/rollup plugins, the implementation itself is not complicated and likely would be easy to port to other build systems.

# Notes

- The remote modules need to be served somehow. This can be through running off a parallel dev server (as demonstrated in the example project), through deployment to a shared, web-accessible server, or copied into the public folder of the host application.
- Module sharing may have some implicit security concerns. I am not a security researcher, and this has not been audited. At the very least, CSP headers should be used to ensure modules are only loaded from trusted sources.
- Each remote should be built similarly to a npm module with an output of an ES module.

# Example Project

This repository includes an example project. This sample projects includes a host application, a remote module, and a shared module.

The host application is a simple React application using react-router-dom. It exposes a shared configuration object (using the `shared` package in this repository), along with several dependencies, to the remote module. The remote module is a react component that reads the shared configuration object. It includes code splitting alongside the code sharing, moving all dependencies into either the `react` bundle or the `vendor` bundle. This is a rather abitrary distinction, and serves as more of an example than anything.
