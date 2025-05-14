import { useQuery } from "@tanstack/react-query";

export const useReceipts = () =>
  useQuery({
    queryKey: ["receipts"],
    queryFn: async () => {
      const res = await fetch("/api/receipts");
      return res.json();
    },
    refetchInterval: 3000,
  });

export const useReceiptById = (id: string) =>
  useQuery({
    queryKey: ["receipt", id],
    queryFn: async () => {
      const res = await fetch(`/api/receipts/getReceiptProducts`);
      return res.json();
    },
  });
