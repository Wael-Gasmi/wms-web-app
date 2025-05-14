import { ChevronUp, Settings, User2 } from "lucide-react";

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ModeToggle } from "./mode-toggle";

export default function AppSidebarFooter() {
  const navigate = useNavigate();
  const { data, setLogout } = useAuthStore();

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: data?.id }),
      });

      const dataRes = await res.json();

      if (!res.ok) {
        console.error(dataRes.error);
      }

      setLogout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Signout failed", error);
    }
  };
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <NavLink to={"/settings"}>
              <Settings />
              <span>Settings</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <span className="cursor-pointer w-full text-left">
              <ModeToggle />
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="cursor-pointer  h-12">
                <User2 />
                <div className="flex flex-col  ">
                  <p className="text-sm font-medium leading-none text-gray-700 dark:text-gray-200 capitalize">
                    {data?.firstName} {data?.lastName}
                  </p>
                  <p className="text-xs leading-none text-slate-400">
                    {data?.email}
                  </p>
                </div>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem>
                <NavLink to="/profile" className="w-full text-left">
                  Profile
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={handleSignOut}
                  className="cursor-pointer w-full text-left"
                >
                  Sign out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
