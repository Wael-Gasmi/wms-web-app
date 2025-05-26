import { useMutation, useQuery } from "@tanstack/react-query";

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
      const res = await fetch(`/api/receipts/${id}`);
      return await res.json();
    },
  });

export const useDownloadReceiptPdf = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/receipts/${id}/pdf`, {
        method: "GET",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to download PDF: ${error}`);
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType !== "application/pdf") {
        const errorText = await response.text();
        throw new Error(`Expected PDF but got: ${contentType}\n${errorText}`);
      }

      const blob = await response.blob();
      console.log("Blob type:", blob.type); // Doit être "application/pdf"

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt_${id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};
