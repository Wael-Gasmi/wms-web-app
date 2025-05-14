import { useEffect, useState } from "react";
import { SidebarProvider } from "./ui/sidebar";
import App from "@/App";
import Cookies from "js-cookie";
export default function AppSidebarProvider() {
  const [defaultOpen] = useState(() => Cookies.get("sidebar_state") === "true");

  useEffect(() => {
    Cookies.set("sidebar_state", defaultOpen.toString());
  }, [defaultOpen]);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <App />,
    </SidebarProvider>
  );
}
