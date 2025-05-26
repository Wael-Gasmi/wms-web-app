import { useQuery } from "@tanstack/react-query";

import { queryClient } from "@/query/queryClient";
import { Product } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const createProduct = async (productData: Product): Promise<Product> => {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  return res.json();
};

export const useCreateProduct = () =>
  useMutation<Product, Error, Product>({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });

const deleteProduct = async (productId: string): Promise<void> => {
  const res = await fetch(`/api/products/${productId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }
};

export const useDeleteProduct = () => {
  return useMutation<void, Error, string>({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });
};

const editProduct = async (productData: Product): Promise<Product> => {
  const res = await fetch(`/api/products/${productData.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    throw new Error("Failed to update product");
  }

  return res.json();
};

export const useEditProduct = () => {
  return useMutation<Product, Error, Product>({
    mutationFn: editProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully", {
        duration: 3000,
        richColors: true,
      });
    },
  });
};

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
