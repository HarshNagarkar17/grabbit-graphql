import { createBrowserRouter, type RouteObject } from "react-router-dom";
import IndexPage from "./Index";
import AuthLayout from "./auth/AuthLayout";
import SignInPage from "./auth/SignIn";
import SignUpPage from "./auth/SignUpPage";
import ProtectedPagesLayout from "./ProtectedPagesLayout";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedPagesLayout />,
    children: [{ path: "/", index: true, element: <IndexPage /> }],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
