import { queryClient } from "@/query/queryClient";
import { Role } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const createRole = async (roleData: Role): Promise<Role> => {
  console.log("from useCreateRole");
  console.log(roleData);
  const res = await fetch("/api/roles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(roleData),
  });

  return res.json();
};

export const useCreateRole = () =>
  useMutation<Role, Error, Role>({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role created successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });

const deleteRole = async (roleId: string): Promise<void> => {
  const res = await fetch(`/api/roles/${roleId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete role");
  }
};

export const useDeleteRole = () => {
  return useMutation<void, Error, string>({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });
};

const editRole = async (roleData: Role): Promise<Role> => {
  const res = await fetch(`/api/roles/${roleData.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(roleData),
  });

  if (!res.ok) {
    throw new Error("Failed to update role");
  }

  return res.json();
};

export const useEditRole = () => {
  return useMutation<Role, Error, Role>({
    mutationFn: editRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role updated successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });
};
