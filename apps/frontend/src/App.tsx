import { Navigate, Route, Routes } from "react-router-dom";
import SideBar from "./components/layouts/SideBar";
import StatusBar from "./components/layouts/StatusBar";
import TopBar from "./components/layouts/TopBar";
import { navRoutes } from "./const/navRoutes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const App = () => {
  return (
    <div className="relative w-full h-dvh">
      <TopBar />
      <SideBar />
      <div
        className="
        h-[calc(100dvh-96px)] w-full fixed top-12 right-0 overflow-auto
        lg:w-[calc(100%-288px)] z-1
        "
      >
        <Routes>
          <Route index element={<Navigate to="/dashboard" />} />
          {navRoutes.map((route) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );
          })}
        </Routes>
      </div>
      <StatusBar />
      <ReactQueryDevtools />
    </div>
  );
};

export default App;
