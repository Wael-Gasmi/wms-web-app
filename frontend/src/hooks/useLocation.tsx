import { useQuery } from "@tanstack/react-query";

export const useLocations = () =>
  useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await fetch("/api/locations");
      return res.json();
    },
    refetchInterval: 3000,
  });

export const useLocationById = (id: string) =>
  useQuery({
    queryKey: ["location", id],
    queryFn: async () => {
      const res = await fetch(`/api/locations/${id}`);
      return await res.json();
    },
  });
