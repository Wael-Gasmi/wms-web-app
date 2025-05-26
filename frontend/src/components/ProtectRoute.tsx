import { ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import { Session } from "@/types/types";
import NotAuthorized from "@/pages/NotAuthorized";

type ProtectRouteProps = {
  route: string;
  children: ReactNode;
};

export default function ProtectRoute({ route, children }: ProtectRouteProps) {
  const { data } = useAuthStore();
  const sessions = data?.menu?.sessions;

  const isAuthorized =
    Array.isArray(sessions) &&
    sessions.some(
      (session: Session) => session.name.toLowerCase() === route.toLowerCase()
    );

  if (!isAuthorized) {
    return <NotAuthorized />;
  }

  return <>{children}</>;
}
