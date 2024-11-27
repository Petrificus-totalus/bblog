import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./Home";
import Expense from "./pages/Spend/expense";
import Algorithm from "./pages/Learn/algorithm";
import Chart from "./pages/Spend/chart";
import Swallow from "./pages/Swallow/swallow";

import Layout from "./pages/layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "*",
    element: <Layout />,
    children: [
      {
        path: "expenses",
        element: <Expense />,
      },
      {
        path: "chart",
        element: <Chart />,
      },
      {
        path: "algorithm",
        element: <Algorithm />,
      },
      {
        path: "swallow",
        element: <Swallow />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
