import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import AppSidebarFooter from "./appSidebarFooter";
import RenderIcon from "./renderIcon";

export function AppSidebar() {
  const { data } = useAuthStore();
  const menu = data?.menu?.sessions;
  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{data?.menu?.name}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu &&
                menu.map((item) =>
                  item.subSessions && item.subSessions.length > 0 ? (
                    <Collapsible className="group/collapsible" key={item.name}>
                      <SidebarMenuItem className={"cursor-pointer"}>
                        <CollapsibleTrigger asChild>
                          <p>
                            <SidebarMenuButton
                              className="cursor-pointer"
                              tooltip={item.name}
                            >
                              <RenderIcon icon={item.icon} />
                              <span>{item.name}</span>
                            </SidebarMenuButton>
                          </p>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subSessions.map((subItem) => (
                              <NavLink
                                to={subItem.path}
                                className={({ isActive }) =>
                                  isActive ? "text-amber-600 " : ""
                                }
                                key={subItem.name}
                              >
                                <SidebarMenuButton
                                  className="cursor-pointer"
                                  tooltip={item.name}
                                >
                                  <span>{subItem.name}</span>
                                </SidebarMenuButton>
                              </NavLink>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild tooltip={item.name}>
                        <NavLink to={item.path}>
                          <RenderIcon icon={item.icon} />
                          <span>{item.name}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <AppSidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
