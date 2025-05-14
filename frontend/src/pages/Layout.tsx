import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex h-screen w-screen">
      <AppSidebar />
      <SidebarTrigger className="cursor-pointer" />
      <div className="flex-1 ">
        <Outlet /> <Toaster />
      </div>
    </div>
  );
}

export default Layout;
