import { User } from "@/types/types";
import { create } from "zustand";

type AuthStore = {
  data: User | null;
  loading: boolean;
  setAuthUserData: (data: User | null) => void;
  fetchUser: () => Promise<void>;
  setLogout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  data: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
  fetchUser: async () => {
    set({ loading: true });

    try {
      const res = await fetch("/api/auth/isAuthenticated", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Unauthorized");

      const result = await res.json();

      localStorage.setItem("user", JSON.stringify(result.data));
      set({ data: result.data, loading: false });
    } catch {
      localStorage.removeItem("user");
      set({ data: null, loading: false });
    }
  },
  setAuthUserData: (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    set({ data });
  },
  setLogout: () => {
    localStorage.removeItem("user");
    set({ data: null });
  },
}));
