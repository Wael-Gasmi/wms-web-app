import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Product } from "@/types/types";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

type ProductSheetProps = {
  item: Product;
};

export default function ProductSheet({ item }: ProductSheetProps) {
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="text-xl  py-5">Product Details </SheetTitle>
        <SheetDescription></SheetDescription>
      </SheetHeader>
      <div className="grid gap-4  px-10">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left col-span-1">
            Product Name{" "}
          </Label>
          <Textarea
            id="qty_available"
            value={item.name ?? ""}
            className="col-span-3 resize-none"
            disabled
          />
        </div>
        <Separator />
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left col-span-1">
            Quantity On Hand
          </Label>
          <Input
            id="qty_available"
            value={item.qty_available ?? ""}
            className="col-span-3"
            disabled
          />
        </div>
        <Separator />
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="" className="text-left col-span-1">
            Sales Price
          </Label>
          <Input
            id="list_price"
            value={item.list_price ?? ""}
            className="col-span-3"
            disabled
          />
        </div>{" "}
        <Separator />
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="" className="text-left col-span-1">
            Cost
          </Label>
          <Input
            id="list_price"
            value={item.standard_price ?? ""}
            className="col-span-3"
            disabled
          />
        </div>{" "}
        <Separator />
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="" className="text-left col-span-1">
            Category
          </Label>
          <Input
            id="categ_id"
            value={!item.categ_id ? "None" : item.categ_id ?? ""}
            className="col-span-3"
            disabled
          />
        </div>{" "}
        <Separator />
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="" className="text-left col-span-1">
            Reference
          </Label>
          <Input
            id="default_code"
            value={item.default_code ?? ""}
            className="col-span-3"
            disabled
          />
        </div>{" "}
        <Separator />
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="" className="text-left col-span-1">
            Barcode
          </Label>
          <Input
            id="barcode"
            value={item.barcode ?? ""}
            className="col-span-3"
            disabled
          />
        </div>
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button className="cursor-pointer">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
