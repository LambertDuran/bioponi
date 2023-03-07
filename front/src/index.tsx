import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import ErrorPage from "./pages/error-page";
import Settings from "./pages/Settings/settings";
import Diary from "./pages/diary";
import Balance from "./pages/balance";
import DailyCard from "./pages/dailyCard";
import DashBoard from "./pages/dashBoard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/tableau-de-bord",
        element: <DashBoard />,
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
        path: "/fiche-journalière",
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
