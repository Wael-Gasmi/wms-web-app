import { useQuery } from "@tanstack/react-query";

export const useDeliveries = () =>
  useQuery({
    queryKey: ["deliveries"],
    queryFn: async () => {
      const res = await fetch("/api/deliveries");
      return res.json();
    },
    refetchInterval: 3000,
  });
