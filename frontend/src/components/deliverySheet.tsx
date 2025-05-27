import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Delivery } from "@/types/types";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
   TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { useDeliveryById } from "@/hooks/useDelivery";

type DeliverySheetProps = {
  item: Delivery;
};

type DeliveryProduct = {
  id: string;
  product_id: [number, string];
  product_uom_qty: number;
};

export default function DeliverySheet({ item }: DeliverySheetProps) {
//   const { data: delivery } = useDeliveryById(item.id ?? "");

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="text-xl  py-5">Delivery Products</SheetTitle>
        <SheetDescription>Delivery {item.name}</SheetDescription>
      </SheetHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Product</TableHead>
            <TableHead>Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {Array.isArray(delivery) &&
            delivery.map((product: DeliveryProduct) => (
              <TableRow key={product.id}>
                <TableCell>{product.product_id[1]}</TableCell>
                <TableCell>{product.product_uom_qty}</TableCell>
              </TableRow>
            ))} */}
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
