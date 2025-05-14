import { useQuery } from "@tanstack/react-query";

export const useSessions = () =>
  useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await fetch("/api/sessions");
      return res.json();
    },
  });

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      return res.json();
    },
  });

export const useRoles = () =>
  useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await fetch("/api/roles");
      return res.json();
    },
  });

export const useMenus = () =>
  useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      const res = await fetch("/api/menus");
      return res.json();
    },
  });

