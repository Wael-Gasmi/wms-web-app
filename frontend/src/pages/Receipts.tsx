import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/dataTableColumnHeader";
import LoadingPage from "@/components/LoadingPage";
import { Separator } from "@/components/ui/separator";
import { Receipt } from "@/types/types";
import { ColumnDef, Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useReceiptById, useReceipts } from "@/hooks/useReceipt";
import ReceiptSheet from "@/components/receiptSheet";
import { useState } from "react";
import ErrorPage from "@/components/ErrorPage";

const tableColumns = [
  { label: "Name", name: "name" },
  { label: "Contact", name: "partner_id" },
  { label: "Status", name: "state" },
]; 

export default function Receipts() {
  const { data: receipts, isLoading, isError } = useReceipts();
  const [selectedReceiptId, setSelectedReceiptId] = useState<string>("");

  const { data: receipt } = useReceiptById(selectedReceiptId);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  const handleReceiptProducts = (id: string) => {
    setSelectedReceiptId(id);
  };

  const columns: ColumnDef<Receipt>[] = [
    ...tableColumns.map((column) => ({
      accessorKey: column.name,
      header: ({ column: col }: { column: Column<Receipt> }) => (
        <DataTableColumnHeader column={col} title={column.label} />
      ),
      id: column.name,
    })),
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="link"
                className="cursor-pointer"
                onClick={() => handleReceiptProducts(item.name ?? "")}
              >
                <EyeIcon />
              </Button>
            </SheetTrigger>
            <ReceiptSheet item={item} receipt={receipt} />
          </Sheet>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-10 px-5  overflow-hidden">
      <h1 className="text-2xl font-bold tracking-tighter  ">Manage Receipt</h1>
      <Separator className="my-5" />
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={receipts ?? []} form="receipt" />
      </div>
    </div>
  );
}
