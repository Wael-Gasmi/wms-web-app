import { useQuery } from "@tanstack/react-query";

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      return res.json();
    },
    refetchInterval: 3000,
  });

export const useProductById = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      return res.json();
    },
  });
