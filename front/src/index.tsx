import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import ErrorPage from "./pages/error-page";
import Settings from "./pages/Settings/settings";
import Diary from "./pages/Diary/diary";
import Balance from "./pages/balance";
import DailyCard from "./pages/dailyCard";
import Pools from "./pages/Pools/pools";
import Login from "./pages/login";

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
        element: <DailyCard />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
