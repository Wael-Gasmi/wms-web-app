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
import { Product, Receipt } from "@/types/types";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

type ReceiptSheetProps = {
  item: Receipt;
  receipt: Product[];
};

export default function ReceiptSheet({ item, receipt }: ReceiptSheetProps) {
  console.log("receipt", receipt);
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="text-xl  py-5">Receipt Products</SheetTitle>
        <SheetDescription></SheetDescription>
      </SheetHeader>
      <div className="grid gap-4  px-10">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left col-span-1">
            Receipt Name{" "}
          </Label>
          <Textarea
            id="name"
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
            id="partner_id"
            value={item.partner_id ?? ""}
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
            id="sheduled_date"
            value={item.sheduled_date ?? ""}
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
            id="state"
            value={item.state ?? ""}
            className="col-span-3"
            disabled
          />
        </div>{" "}
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button className="cursor-pointer">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
