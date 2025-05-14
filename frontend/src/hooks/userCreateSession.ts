import { queryClient } from "@/query/queryClient";
import { Session } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const createSession = async (sessionData: Session): Promise<Session> => {
  console.log("from useCreateSession");
  console.log(sessionData);
  const res = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sessionData),
  });

  return res.json();
};

export const useCreateSession = () =>
  useMutation<Session, Error, Session>({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session created successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });

const deleteSession = async (sessionId: string): Promise<void> => {
  const res = await fetch(`/api/sessions/${sessionId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete session");
  }
};

export const useDeleteSession = () => {
  return useMutation<void, Error, string>({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session deleted successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });
};

const editSession = async (sessionData: Session): Promise<Session> => {
  const res = await fetch(`/api/sessions/${sessionData.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sessionData),
  });

  if (!res.ok) {
    throw new Error("Failed to update session");
  }

  return res.json();
};

export const useEditSession = () => {
  return useMutation<Session, Error, Session>({
    mutationFn: editSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session updated successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });
};
