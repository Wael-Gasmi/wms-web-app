import { queryClient } from "@/query/queryClient";
import { Menu } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const createMenu = async (menuData: Menu): Promise<Menu> => {
  console.log("from useCreateMenu");
  console.log(menuData);
  const res = await fetch("/api/menus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(menuData),
  });

  return res.json();
};

export const useCreateMenu = () =>
  useMutation<Menu, Error, Menu>({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Menu created successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });

const deleteMenu = async (menuId: string): Promise<void> => {
  const res = await fetch(`/api/menus/${menuId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete menu");
  }
};

export const useDeleteMenu = () => {
  return useMutation<void, Error, string>({
    mutationFn: deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Menu deleted successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });
};

const editMenu = async (menuData: Menu): Promise<Menu> => {
  const res = await fetch(`/api/menus/${menuData.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(menuData),
  });

  if (!res.ok) {
    throw new Error("Failed to update menu");
  }

  return res.json();
};

export const useEditMenu = () => {
  return useMutation<Menu, Error, Menu>({
    mutationFn: editMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Menu updated successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });
};
