// Import Dependencies
import { Navigate } from "react-router";

// Local Imports
import { AppLayout } from "app/layouts/AppLayout";
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";

// ----------------------------------------------------------------------

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    // The dynamic layout supports both the main layout and the sideblock.
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboards/home" />,
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <Navigate to="/dashboards/home" />,
            },
            {
              path: "home",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/home")).default,
              }),
            },
            {
              path: "brand",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/brand"))
                  .default,
              }),
            },
            {
              path: "assets",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/assets"))
                  .default,
              }),
            },
            {
              path: "assets/:type",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/assets/Inner"))
                  .default,
              }),
            },
            {
              path: "integration",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/integration"))
                  .default,
              }),
            },
            {
              path: "ai-image",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/ai-image"))
                  .default,
              }),
            },
            {
              path: "ai-image/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/ai-image/form"))
                  .default,
              }),
            },
            {
              path: "ai-image/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/ai-image/form"))
                  .default,
              }),
            },
            {
              path: "ai-video",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/ai-video"))
                  .default,
              }),
            },
            {
              path: "ai-video/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/ai-video/form"))
                  .default,
              }),
            },
            {
              path: "ai-video/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/ai-video/form"))
                  .default,
              }),
            },
            {
              path: "campaign",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/campaign"))
                  .default,
              }),
            },
            {
              path: "campaign/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/campaign/form"))
                  .default,
              }),
            },
            {
              path: "campaign/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/campaign/form"))
                  .default,
              }),
            },
          ],
        },
        {
          path: "masters",
          children: [
            {
              index: true,
              element: <Navigate to="/masters/region" />,
            },
            {
              path: "region",
              lazy: async () => ({
                Component: (await import("app/pages/masters/region"))
                  .default,
              }),
            },
            {
              path: "region/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/masters/region/form"))
                  .default,
              }),
            },
            {
              path: "region/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/masters/region/form"))
                  .default,
              }),
            },
            {
              path: "target-group",
              lazy: async () => ({
                Component: (await import("app/pages/masters/target-group"))
                  .default,
              })
            },
            {
              path: "target-group/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/masters/target-group/form"))
                  .default,
              }),
            },
            {
              path: "target-group/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/masters/target-group/form"))
                  .default,
              }),
            },
            {
              path: "social-media",
              lazy: async () => ({
                Component: (await import("app/pages/masters/social-media"))
                  .default,
              })
            },
            {
              path: "social-media/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/masters/social-media/form"))
                  .default,
              }),
            },
            {
              path: "social-media/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/masters/social-media/form"))
                  .default,
              }),
            },
            {
              path: "my-goal",
              lazy: async () => ({
                Component: (await import("app/pages/masters/my-goal"))
                  .default,
              })
            },
            {
              path: "my-goal/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/masters/my-goal/form"))
                  .default,
              }),
            },
            {
              path: "my-goal/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/masters/my-goal/form"))
                  .default,
              }),
            },
          ]
        },
      ]
    },
    {
      Component: AppLayout,
      children: [
        {
          path: "settings",
          lazy: async () => ({
            Component: (await import("app/pages/settings/Layout")).default,
          }),
          children: [
            {
              index: true,
              element: <Navigate to="/settings/general" />,
            },
            {
              path: "general",
              lazy: async () => ({
                Component: (await import("app/pages/settings/sections/General"))
                  .default,
              }),
            },
            {
              path: "appearance",
              lazy: async () => ({
                Component: (
                  await import("app/pages/settings/sections/Appearance")
                ).default,
              }),
            },
            {
              path: "sessions",
              lazy: async () => ({
                Component: (
                  await import("app/pages/settings/sections/Sessions")
                ).default,
              }),
            }
          ],
        },
      ],
    },
  ]
};

export { protectedRoutes };
