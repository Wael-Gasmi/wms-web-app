import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/dataTableColumnHeader";
import { Separator } from "@/components/ui/separator";
import { useMouvements } from "@/hooks/useMouvement";
import { Movement } from "@/types/types";
import { ColumnDef, Column } from "@tanstack/react-table";

export default function StockMovements() {
  const { data: movements, isLoading, isError } = useMouvements();
  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  const columns: ColumnDef<Movement>[] = [
    {
      accessorKey: "id",
      header: ({ column }: { column: Column<Movement> }) => (
        <DataTableColumnHeader column={column} title="id" />
      ),
      id: "id",
      meta: {
        hidden: true,
      },
    },
    {
      accessorKey: "product_id",
      header: ({ column }: { column: Column<Movement> }) => (
        <DataTableColumnHeader column={column} title="Product" />
      ),
      id: "product_id",
      cell: ({ row }) => row.original.product_id?.[1] ?? "Unknown",
      meta: { hidden: false },
    },
    {
      accessorKey: "location_id",
      header: ({ column }: { column: Column<Movement> }) => (
        <DataTableColumnHeader column={column} title="Receive From" />
      ),
      id: "location_id",
      cell: ({ row }) => row.original.location_id?.[1],
      meta: { hidden: false },
    },
    {
      accessorKey: "location_dest_id",
      header: ({ column }: { column: Column<Movement> }) => (
        <DataTableColumnHeader column={column} title="To" />
      ),
      id: "location_dest_id",
      cell: ({ row }) => row.original.location_dest_id?.[1],
      meta: { hidden: false },
    },
    {
      accessorKey: "date",
      header: ({ column }: { column: Column<Movement> }) => (
        <DataTableColumnHeader column={column} title="On" />
      ),
      id: "date",
      meta: { hidden: false },
    },

    {
      accessorKey: "product_uom_qty",
      header: ({ column }: { column: Column<Movement> }) => (
        <DataTableColumnHeader column={column} title="Quantity" />
      ),
      id: "product_uom_qty",
      meta: { hidden: false },
    },
  ];

  const visibleColumns = columns.filter((col) => !col.meta?.hidden);

  return (
    <div className="container mx-auto py-10 px-5 overflow-hidden">
      <h1 className="text-2xl font-bold tracking-tighter">Stock Movements</h1>
      <Separator className="my-5" />
      <div className="overflow-x-auto">
        <DataTable
          columns={visibleColumns}
          data={movements ?? []}
          form="receipt"
        />
      </div>
    </div>
  );
}
