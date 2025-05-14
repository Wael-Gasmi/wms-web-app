import { queryClient } from "@/query/queryClient";
import { User } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const createUser = async (userData: User): Promise<User> => {
  console.log("from useCreateUser");
  console.log(userData);
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  return res.json();
};

export const useCreateUser = () =>
  useMutation<User, Error, User>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });

const deleteUser = async (userId: string): Promise<void> => {
  const res = await fetch(`/api/users/${userId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
};

export const useDeleteUser = () => {
  return useMutation<void, Error, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });
};

const editUser = async (userData: User): Promise<User> => {
  const res = await fetch(`/api/users/${userData.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error("Failed to update user");
  }

  return res.json();
};

export const useEditUser = () => {
  return useMutation<User, Error, User>({
    mutationFn: editUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });
};
