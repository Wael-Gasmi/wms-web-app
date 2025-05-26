import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/dataTableColumnHeader";
import LoadingPage from "@/components/LoadingPage";
import { Separator } from "@/components/ui/separator";
import { useProducts } from "@/hooks/useProduct";
import { Product } from "@/types/types";
import { ColumnDef, Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import ProductSheet from "@/components/productSheet";
import ErrorPage from "@/components/ErrorPage";

const tableColumns = [
  { label: "Name", name: "name" },
  { label: "Price", name: "list_price" },
  { label: "Reference", name: "default_code" },
  { label: "Cost", name: "standard_price" },
  { label: "Quantity", name: "qty_available" },
  { label: "Forecasted", name: "virtual_available" },
];

export default function ManageProduct() {
  const { data: products, isLoading, isError } = useProducts();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  const columns: ColumnDef<Product>[] = [
    ...tableColumns.map((column) => ({
      accessorKey: column.name,
      header: ({ column: col }: { column: Column<Product> }) => (
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
              <Button variant="link" className="cursor-pointer">
                <EyeIcon />
              </Button>
            </SheetTrigger>
            <ProductSheet item={item} />
          </Sheet>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-10 px-5  overflow-hidden">
      <h1 className="text-2xl font-bold tracking-tighter  ">Products</h1>
      <Separator className="my-5" />
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={products ?? []} form="product" />
      </div>
    </div>
  );
}
