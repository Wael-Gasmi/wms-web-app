import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/dataTableColumnHeader";
import LoadingPage from "@/components/LoadingPage";
import { Separator } from "@/components/ui/separator";
import { ColumnDef, Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useDownloadReceiptPdf } from "@/hooks/useReceipt";
import ErrorPage from "@/components/ErrorPage";
import { useLocations } from "@/hooks/useLocation";
import LocationSheet from "@/components/locationSheet";
import { Location } from "@/types/types";

export default function Locations() {
  const { data: locations, isLoading, isError } = useLocations();
  const { mutate: downloadPdf } = useDownloadReceiptPdf();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  const columns: ColumnDef<Location>[] = [
    {
      accessorKey: "id",
      header: ({ column }: { column: Column<Location> }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      id: "id",
      meta: {
        hidden: true,
      },
    },
    {
      accessorKey: "name",
      header: ({ column }: { column: Column<Location> }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      id: "name",
      meta: {
        hidden: false,
      },
    },
    {
      accessorKey: "complete_name",
      header: ({ column }: { column: Column<Location> }) => (
        <DataTableColumnHeader column={column} title="Complete Name" />
      ),
      id: "complete_name",
      meta: {
        hidden: false,
      },
    },
    {
      accessorKey: "scheduled_date",
      header: ({ column }: { column: Column<Location> }) => (
        <DataTableColumnHeader column={column} title="Scheduled Date" />
      ),
      id: "scheduled_date",
      meta: {
        hidden: false,
      },
      cell: ({ row }) => {
        const date = row.original.scheduled_date;
        return date ? new Date(date).toLocaleDateString() : "-";
      },
    },
    {
      accessorKey: "state",
      header: ({ column }: { column: Column<Location> }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      id: "state",
      meta: {
        hidden: false,
      },
      cell: ({ row }) => {
        const status = row.original.state ?? "";
        return <span className="capitalize">{status}</span>;
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
            <LocationSheet item={item} />
          </Sheet>
        );
      },
    },
  ];

  const visibleColumns = columns.filter((col) => !col.meta?.hidden);

  return (
    <div className="container mx-auto py-10 px-5 overflow-hidden">
      <h1 className="text-2xl font-bold tracking-tighter">Locations</h1>
      <Separator className="my-5" />
      <div className="overflow-x-auto">
        <DataTable
          columns={visibleColumns}
          data={locations ?? []}
          form="location"
        />
      </div>
    </div>
  );
}
