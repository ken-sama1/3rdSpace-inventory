import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import InitializeSession from "./components/auth/InitializeSession";
import SideBar from "./components/layouts/SideBar";
import StatusBar from "./components/layouts/StatusBar";
import TopBar from "./components/layouts/TopBar";
import { useAuth } from "./hooks/auth/useAuth";
import { useSession } from "./hooks/auth/useSession";
import NotFound from "./pages/NotFound";
import { navRoutes } from "./routes/nav-routes";

const AppContent = () => {
  useSession();
  const { user } = useAuth();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  return (
    <div className="relative w-full h-dvh">
      <TopBar
        isNavigationOpen={isNavigationOpen}
        onMenuClick={() => {
          setIsNavigationOpen((open) => !open);
        }}
      />
      <SideBar
        isOpen={isNavigationOpen}
        onClose={() => {
          setIsNavigationOpen(false);
        }}
      />
      <div
        className="
        h-[calc(100dvh-96px)] w-full fixed top-12 right-0 overflow-auto
        lg:w-[calc(100%-288px)] z-1
        "
      >
        <Routes>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<NotFound />} />
          {navRoutes.map((route) => {
            if (!route.roles || route.roles.includes(user?.role ?? "STAFF"))
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
    </div>
  );
};

const App = () => {
  return (
    <InitializeSession>
      <AppContent />
    </InitializeSession>
  );
};

export default App;
