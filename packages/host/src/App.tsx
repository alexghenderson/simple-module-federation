import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "shared/config";
import { config } from "./config";

const Test = React.lazy(
	() =>
		import(/* @vite-ignore */ `${config.remoteModules}/Test.js`) as Promise<
			typeof import("remote/Test")
		>,
);

interface Config {
	remote: string;
}

const Local = () => (
	<div>
		<Link to="/remote">To remote</Link>Hello World
	</div>
);

export const App = () => {
	return (
		<ConfigProvider<Config> config={config}>
			<React.Suspense fallback={<div>Loading...</div>}>
				<BrowserRouter>
					<Routes>
						<Route path="/local" Component={Local} />
						<Route path="/remote" Component={Test} />
					</Routes>
				</BrowserRouter>
			</React.Suspense>
		</ConfigProvider>
	);
};
