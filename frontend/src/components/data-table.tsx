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
  SelectGroup,
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
import ProductForm from "./ProductForm";
import { on } from "events";

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
  const [stateFilter, setStateFilter] = React.useState<string>("");

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      phoneNumber: false,
      dateOfBirth: false,
      gender: false,
      address: false,
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
      case "product":
        return <ProductForm />;
      default:
        return <></>;
    }
  };

  const showAddButton = ["receipt", "deliverie"];
  const showDeleteButton = ["product", "receipt", "deliverie"];

  const { exportCSV, exportPDF } = useExport();

  const getExportableColumns = () =>
    table
      .getVisibleFlatColumns()
      .filter((col) => col.id !== "actions") // exclude action column
      .map((col) => col.id);

  const getExportableData = () =>
    table.getRowModel().rows.map((row) => {
      const rowData: Record<string, any> = {};
      row.getVisibleCells().forEach((cell) => {
        if (cell.column.id !== "actions") {
          rowData[cell.column.id] = cell.getValue();
        }
      });
      return rowData;
    });

  const onCSV = () => {
    const cols = getExportableColumns();
    const data = getExportableData();
    exportCSV(cols, data);
  };

  const onPDF = () => {
    const cols = getExportableColumns();
    const data = getExportableData();
    exportPDF(cols, data);
  };
  

  return (
    <div className="w-full    overflow-hidden ">
      <div>
        <div className="flex items-center py-4 justify-between ">
          <div className="flex items-center gap-2">
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
            />{" "}
            {form == "receipt" && (
              <Select
                value={stateFilter}
                onValueChange={(value) => {
                  setStateFilter(value);
                  if (value === "all") {
                    table.getColumn("state")?.setFilterValue("");
                    return;
                  }
                  table
                    .getColumn("state")
                    ?.setFilterValue(value.toLocaleLowerCase());
                }}
              >
                <SelectTrigger className="w-[180px] cursor-pointer">
                  <SelectValue placeholder="Filter by state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="cursor-pointer" value="all">
                      All
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="done">
                      Done
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="cancel">
                      Cancel
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="ready">
                      Ready
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="assigned">
                      Assigned
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex items-center gap-2 ">
            <>
              {!showAddButton.includes(form ?? "") && (
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
              )}
              {!showDeleteButton.includes(form ?? "") && (
                <Button
                  className="cursor-pointer"
                  size="sm"
                  variant={"outline"}
                >
                  <TrashIcon />
                </Button>
              )}
            </>
            <DataTableViewOptions table={table} />
            <Select>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="flex flex-col">
                  <Button
                    value="csv"
                    onClick={onCSV}
                    className="cursor-pointer"
                    variant={"ghost"}
                  >
                    Download CSV
                  </Button>
                  <Button
                    value="pdf"
                    onClick={onPDF}
                    className="cursor-pointer"
                    variant={"ghost"}
                  >
                    Download PDF
                  </Button>
                </SelectGroup>{" "}
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
                      <React.Fragment key={cell.id}>
                        <TableCell>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      </React.Fragment>
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
