import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/dataTableColumnHeader";
import LoadingPage from "@/components/LoadingPage";
import { Separator } from "@/components/ui/separator";
import { Receipt } from "@/types/types";
import { ColumnDef, Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useDownloadReceiptPdf, useReceipts } from "@/hooks/useReceipt";
import ReceiptSheet from "@/components/receiptSheet";
import ErrorPage from "@/components/ErrorPage";
import { Badge } from "@/components/ui/badge";

export default function Receipts() {
  const { data: receipts, isLoading, isError } = useReceipts();
  const { mutate: downloadPdf } = useDownloadReceiptPdf();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "done":
        return <Badge variant="default">Done</Badge>;
      case "cancel":
        return <Badge variant="destructive">Cancel</Badge>;
      case "assigned":
        return <Badge variant="secondary">Assigned</Badge>;
      case "ready":
        return <Badge variant="outline">Ready</Badge>;
      case "draft":
        return <Badge variant="destructive">Draft</Badge>;
    }
  };

  const columns: ColumnDef<Receipt>[] = [
    {
      accessorKey: "id",
      header: ({ column }: { column: Column<Receipt> }) => (
        <DataTableColumnHeader column={column} title="id" />
      ),
      id: "id",
      meta: {
        hidden: true,
      },
    },
    {
      accessorKey: "name",
      header: ({ column }: { column: Column<Receipt> }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      id: "name",
      meta: {
        hidden: false,
      },
    },
    {
      accessorKey: "partner_id.name",
      header: ({ column }: { column: Column<Receipt> }) => (
        <DataTableColumnHeader column={column} title="Receive From" />
      ),
      id: "partner_id.name",
      meta: {
        hidden: false,
      },
    },
    {
      accessorKey: "scheduled_date",
      header: ({ column }: { column: Column<Receipt> }) => (
        <DataTableColumnHeader column={column} title="Scheduled Date" />
      ),
      id: "scheduled_date",
      meta: {
        hidden: false,
      },
    },
    {
      accessorKey: "state",
      header: ({ column }: { column: Column<Receipt> }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      id: "state",
      meta: {
        hidden: false,
      },
      cell: ({ row }) => {
        const item = row.original;
        return getStatusBadge(item.state ?? "");
      },
    },
    {
      id: "print",
      meta: {
        hidden: false,
      },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => downloadPdf(item.id ?? "")}
          >
            Print
          </Button>
        );
      },
    },
    {
      id: "actions",
      meta: {
        hidden: false,
      },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="cursor-pointer">
                <EyeIcon />
              </Button>
            </SheetTrigger>
            <ReceiptSheet item={item} />
          </Sheet>
        );
      },
    },
  ];

  const visibleColumns = columns.filter((col) => !col.meta?.hidden);

  return (
    <div className="container mx-auto py-10 px-5 overflow-hidden">
      <h1 className="text-2xl font-bold tracking-tighter">Receipts</h1>
      <Separator className="my-5" />
      <div className="overflow-x-auto">
        <DataTable
          columns={visibleColumns}
          data={receipts ?? []}
          form="receipt"
        />
      </div>
    </div>
  );
}
