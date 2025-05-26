import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Receipt } from "@/types/types";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReceiptById } from "@/hooks/useReceipt";

type ReceiptSheetProps = {
  item: Receipt;
};

type ReceiptProduct = {
  id: string;
  product_id: [number, string];
  product_uom_qty: number;
};

export default function ReceiptSheet({ item }: ReceiptSheetProps) {
  const { data: receipt } = useReceiptById(item.id ?? "");

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="text-xl  py-5">Receipt Products</SheetTitle>
        <SheetDescription>Receipt {item.name}</SheetDescription>
      </SheetHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Product</TableHead>
            <TableHead>Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipt &&
            receipt.map((product: ReceiptProduct) => (
              <TableRow key={product.id}>
                <TableCell>{product.product_id[1]}</TableCell>
                <TableCell>{product.product_uom_qty}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <SheetFooter>
        <SheetClose asChild>
          <Button className="cursor-pointer">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
