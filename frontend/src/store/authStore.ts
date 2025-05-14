import { User } from "@/types/types";
import { create } from "zustand";

type AuthStore = {
  data: User | null;
  setAuthUserData: (data: User | null) => void;
  setLogout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  data: JSON.parse(localStorage.getItem("user") || "null"),
  setAuthUserData: (data) => set({ data }),
  setLogout: async () => {
    localStorage.removeItem("user");
    set({ data: null });
  },
}));
