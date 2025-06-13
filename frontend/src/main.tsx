import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import AppSidebarProvider from "./components/app-sidebarProvider.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query/queryClient";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <QueryClientProvider client={queryClient}>
        <AppSidebarProvider />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
