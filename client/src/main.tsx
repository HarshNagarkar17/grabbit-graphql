import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./apollo/apolloClient.ts";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <Toaster position="top-right" duration={2000} />
      <App />
    </ApolloProvider>
  </StrictMode>
);
