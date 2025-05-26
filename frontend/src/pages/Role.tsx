import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/dataTableColumnHeader";
import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import RoleForm from "@/components/RoleForm";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useDeleteRole } from "@/hooks/useRole";
import { useRoles } from "@/hooks/useData";
import { Role } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef, Column } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function ManageRole() {
  const [editingItem, setEditingItem] = useState<Role | null>(null);
  const { data: roles, isLoading, isError } = useRoles();
  const { mutate: deleteRole } = useDeleteRole();

  const handleDelete = async (id: string) => {
    deleteRole(id);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  const columns: ColumnDef<Role>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }: { column: Column<Role> }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      id: "name",
    },
    {
      accessorKey: "description",
      header: ({ column }: { column: Column<Role> }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      id: "description",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 w-10 p-2 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <MoreHorizontal className="h-5 w-5 text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background shadow-lg rounded-md border w-[100px]"
            >
              <DropdownMenuItem
                className="p-2 outline-0 cursor-pointer"
                onSelect={() => setEditingItem(item)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="p-2 outline-0 cursor-pointer"
                onClick={() => handleDelete(item.id ?? "")}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-10 px-5">
      <h1 className="text-2xl font-bold tracking-tighter">Manage Roles</h1>
      <Separator className="my-5" />
      <DataTable columns={columns} data={roles ?? []} form="role" />
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Edit the role details below.
              </DialogDescription>
            </DialogHeader>
            <RoleForm form={editingItem} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
