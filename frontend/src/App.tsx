import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import ManageMenu from "./pages/Menu";
import ManageRole from "./pages/Role";
import ManageUser from "./pages/User";
import ManageSession from "./pages/Session";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Layout from "./pages/Layout";
import { useAuthStore } from "./store/authStore";
import ProtectRoute from "./components/ProtectRoute";
import Settings from "./pages/settings";
import Reports from "./pages/Reports";
import ManageProduct from "./pages/Product";
import Deliveries from "./pages/Deliveries";
import Receipts from "./pages/Receipts";
import Locations from "./pages/Locations";
import StockMovements from "./pages/StockMovements";
import { useEffect, useState } from "react";

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const data = useAuthStore((state) => state.data);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
  }, [fetchUser]);

  const isAuthenticated = !!data;

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: isAuthenticated ? <Layout /> : <Navigate to="/login" replace />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: "dashboard",
          element: (
            <ProtectRoute route="dashboard">
              <Dashboard />
            </ProtectRoute>
          ),
        },
        {
          path: "reports",
          element: (
            <ProtectRoute route="reports">
              <Reports />
            </ProtectRoute>
          ),
        },
        {
          path: "deliveries",
          element: (
            <ProtectRoute route="deliveries">
              <Deliveries />
            </ProtectRoute>
          ),
        },
        {
          path: "receipts",
          element: (
            <ProtectRoute route="receipts">
              <Receipts />
            </ProtectRoute>
          ),
        },
        {
          path: "movements",
          element: (
            <ProtectRoute route="movements">
              <StockMovements />
            </ProtectRoute>
          ),
        },
        {
          path: "locations",
          element: (
            <ProtectRoute route="locations">
              <Locations />
            </ProtectRoute>
          ),
        },
        {
          path: "products",
          element: (
            <ProtectRoute route="products">
              <ManageProduct />
            </ProtectRoute>
          ),
        },
        {
          path: "management",
          children: [
            {
              index: true,
              element: (
                <ProtectRoute route="management">
                  <ManageUser />
                </ProtectRoute>
              ),
            },
            {
              path: "users",
              element: (
                <ProtectRoute route="management">
                  <ManageUser />
                </ProtectRoute>
              ),
            },
            {
              path: "menus",
              element: (
                <ProtectRoute route="management">
                  <ManageMenu />
                </ProtectRoute>
              ),
            },
            {
              path: "roles",
              element: (
                <ProtectRoute route="management">
                  <ManageRole />
                </ProtectRoute>
              ),
            },
            {
              path: "sessions",
              element: (
                <ProtectRoute route="management">
                  <ManageSession />
                </ProtectRoute>
              ),
            },
          ],
        },
        {
          path: "profile",
          element: isAuthenticated ? (
            <Profile />
          ) : (
            <Navigate to="/login" replace />
          ),
        },
        {
          path: "settings",
          element: isAuthenticated ? (
            <Settings />
          ) : (
            <Navigate to="/login" replace />
          ),
        },
      ],
    },
    {
      path: "/login",
      element: !isAuthenticated ? (
        <Login />
      ) : (
        <Navigate to="/dashboard" replace />
      ),
    },
    {
      path: "/signup",
      element: !isAuthenticated ? (
        <SignUp />
      ) : (
        <Navigate to="/dashboard" replace />
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
