import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/dataTableColumnHeader";
import LoadingPage from "@/components/LoadingPage";
import { Separator } from "@/components/ui/separator";
import { Receipt } from "@/types/types";
import { ColumnDef, Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  useDownloadReceiptPdf,
  useReceipts,
  useValidateReceipt,
} from "@/hooks/useReceipt";
import ReceiptSheet from "@/components/receiptSheet";
import ErrorPage from "@/components/ErrorPage";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Receipts() {
  const { data: receipts, isLoading, isError } = useReceipts();
  const { mutate: downloadPdf } = useDownloadReceiptPdf();
  const { mutate: validateReceipt } = useValidateReceipt();

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
      id: "action",
      meta: {
        hidden: false,
      },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Select>
            <SelectTrigger className="w-[100px] cursor-pointer">
              <SelectValue placeholder="Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="flex flex-col">
                <Button
                  value="print"
                  onClick={() => downloadPdf(item.id ?? "")}
                  className="cursor-pointer"
                  variant={"ghost"}
                >
                  Print
                </Button>
                {item.state === "assigned" && (
                  <Button
                    value="validate"
                    variant={"ghost"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (item.id) {
                        validateReceipt(item.id.toString());
                      }
                    }}
                  >
                    Validate Receipt
                  </Button>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: "show",
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
