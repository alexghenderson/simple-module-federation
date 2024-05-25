import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ConfigProvider } from "shared/config";

const Test = React.lazy(() => import("http://localhost:5001/Test.es.js"));

const Local = () => (
  <div>
    <Link to="/remote">To remote</Link>Hello World
  </div>
);

export const App = () => {
  return (
    <ConfigProvider config={{}}>
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
