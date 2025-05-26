import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/dataTableColumnHeader";
import LoadingPage from "@/components/LoadingPage";
import { Separator } from "@/components/ui/separator";
import { ColumnDef, Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import ErrorPage from "@/components/ErrorPage";
import { Badge } from "@/components/ui/badge";
import { useDeliveries } from "@/hooks/useDelivery";
import { Delivery } from "@/types/types";
import DeliverySheet from "@/components/deliverySheet";

export default function Deliveries() {
  const { data: deliveries, isLoading, isError } = useDeliveries();
  // const { mutate: downloadPdf } = useDownloadDeliveryPdf();

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

  const columns: ColumnDef<Delivery>[] = [
    {
      accessorKey: "id",
      header: ({ column }: { column: Column<Delivery> }) => (
        <DataTableColumnHeader column={column} title="id" />
      ),
      id: "id",
      meta: {
        hidden: true,
      },
    },
    {
      accessorKey: "name",
      header: ({ column }: { column: Column<Delivery> }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      id: "name",
      meta: {
        hidden: false,
      },
    },
    {
      accessorKey: "partner_id.name",
      header: ({ column }: { column: Column<Delivery> }) => (
        <DataTableColumnHeader column={column} title="Delivery To" />
      ),
      id: "partner_id.name",
      meta: {
        hidden: false,
      },
    },
    {
      accessorKey: "scheduled_date",
      header: ({ column }: { column: Column<Delivery> }) => (
        <DataTableColumnHeader column={column} title="Scheduled Date" />
      ),
      id: "scheduled_date",
      meta: {
        hidden: false,
      },
    },
    {
      accessorKey: "state",
      header: ({ column }: { column: Column<Delivery> }) => (
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
            // onClick={() => downloadPdf(item.id ?? "")}
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
            <DeliverySheet item={item} />
          </Sheet>
        );
      },
    },
  ];

  const visibleColumns = columns.filter((col) => !col.meta?.hidden);

  return (
    <div className="container mx-auto py-10 px-5 overflow-hidden">
      <h1 className="text-2xl font-bold tracking-tighter">Deliveries</h1>
      <Separator className="my-5" />
      <div className="overflow-x-auto">
        <DataTable
          columns={visibleColumns}
          data={deliveries ?? []}
          form="delivery"
        />
      </div>
    </div>
  );
}
