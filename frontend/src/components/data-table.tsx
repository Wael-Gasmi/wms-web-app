import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PlusCircle, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import SessionForm from "./SessionForm";
import RoleForm from "./RoleForm";
import MenuForm from "./MenuForm";
import UserForm from "./UserForm";
import { DataTableViewOptions } from "./dataTableViewOptions";
import { DataTablePagination } from "./dataTablePagination";
import { useExport } from "@/hooks/useExport";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  form?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  form,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      phoneNumber: false,
      dateOfBirth: false,
      gender: false,
      address: false,
      categ_id: false,
    });

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 20 },
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const renderForm = (form?: string) => {
    switch (form) {
      case "user":
        return <UserForm />;
      case "menu":
        return <MenuForm />;
      case "role":
        return <RoleForm />;
      case "session":
        return <SessionForm />;
      default:
        return <></>;
    }
  };

  const notShown = ["product", "receipt", "deliverie"];

  const { exportCSV, exportPDF } = useExport();

  return (
    <div className="w-full    overflow-hidden ">
      <div>
        <div className="flex items-center py-4 justify-between ">
          <Input
            placeholder={
              form !== "user" ? "Filter by name..." : "Filter by email..."
            }
            value={
              (table
                .getColumn(form !== "user" ? "name" : "email")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(form !== "user" ? "name" : "email")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          <div className="flex items-center gap-2 ">
            {!notShown.includes(form ?? "") && (
              <>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="cursor-pointer"
                        size="sm"
                        variant="outline"
                      >
                        <PlusCircle />
                        New {form}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New {form}</DialogTitle>
                        <DialogDescription>
                          Fill in the details to add a new {form}.
                        </DialogDescription>
                      </DialogHeader>
                      {renderForm(form as string)}
                    </DialogContent>
                  </Dialog>
                </div>
                <Button
                  className="cursor-pointer"
                  size="sm"
                  variant={"outline"}
                >
                  <TrashIcon />
                </Button>
              </>
            )}
            <DataTableViewOptions table={table} />
            <Select>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv" onClick={exportCSV}>
                  Download CSV
                </SelectItem>
                <SelectItem value="pdf" onClick={exportPDF}>
                  Download PDF
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-md border">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="h-10"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
