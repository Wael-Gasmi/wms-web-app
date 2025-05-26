import { Location } from "@/types/types";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocationById } from "@/hooks/useLocation";

type LocationSheetProps = {
  item: Location;
};

type LocationSheetType = {
  id: string;
  product_id: [number, string];
  product_uom_qty: number;
};

export default function LocationSheet({ item }: LocationSheetProps) {
  const { data: products } = useLocationById(item.id ?? "");

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="text-xl py-5">Receipt Products</SheetTitle>
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
          {products &&
            products.map((product: LocationSheetType) => (
              <TableRow key={product.id}>
                <TableCell>{product.product_id[1]}</TableCell>
                <TableCell>{product.product_uom_qty}</TableCell>{" "}
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
