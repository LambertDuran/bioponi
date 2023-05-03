import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import ErrorPage from "./pages/error-page";
import Settings from "./pages/Settings/settings";
import Diary from "./pages/Diary/diary";
import Balance from "./pages/balance";
import DailySheet from "./pages/DailySheet/dailySheet";
import Pools from "./pages/Pools/pools";
import Login from "./pages/login";
import Admin from "./pages/admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/bassins",
        element: <Pools />,
      },
      {
        path: "/parametrage",
        element: <Settings />,
      },
      {
        path: "/journal",
        element: <Diary />,
      },
      {
        path: "/bilan",
        element: <Balance />,
      },
      {
        path: "/fiche-journaliere",
        element: <DailySheet />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
