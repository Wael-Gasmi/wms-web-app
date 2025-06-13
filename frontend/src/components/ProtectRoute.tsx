import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Session } from "@/types/types";
import NotAuthorized from "@/pages/NotAuthorized";
import { useNavigate } from "react-router-dom";

type ProtectRouteProps = {
  route: string;
  children: ReactNode;
};

export default function ProtectRoute({ route, children }: ProtectRouteProps) {
  const { data, loading, fetchUser } = useAuthStore();
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!data && !loading) {
        await fetchUser();
      }
      setChecked(true);
    };

    checkAuth();
  }, [data, loading, fetchUser]);

  if (!checked || loading) {
    return <div className="p-4">Checking permissions...</div>;
  }

  if (!data) {
    navigate("/login");
    return null;
  }

  const sessions = data.menu?.sessions ?? [];
  const isAuthorized = sessions.some(
    (session: Session) => session.name.toLowerCase() === route.toLowerCase()
  );

  if (!isAuthorized) {
    return <NotAuthorized />;
  }

  return <>{children}</>;
}
