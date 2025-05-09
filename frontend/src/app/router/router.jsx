// Import Dependencies
// import { createBrowserRouter } from "react-router";
import { createHashRouter } from "react-router";

// Local Imports
import Root from "app/layouts/Root";
import RootErrorBoundary from "app/pages/errors/RootErrorBoundary";
import { SplashScreen } from "components/template/SplashScreen";
import { protectedRoutes } from "./protected";
import { ghostRoutes } from "./ghost";
import { publicRoutes } from "./public";

// ----------------------------------------------------------------------

const router = createHashRouter([
  {
    id: "root",
    Component: Root,
    hydrateFallbackElement: <SplashScreen />,
    ErrorBoundary: RootErrorBoundary,
    children: [protectedRoutes, ghostRoutes, publicRoutes],
  },
]);

export default router;
