import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCreateProduct, useEditProduct } from "@/hooks/useProduct";
import { Product } from "@/types/types";

type FormFields = {
  id?: string;
  name: string;
  list_price?: number;
  standard_price?: number;
  default_code?: string;
  barcode?: string;
};

type ProductFormProps = {
  form?: Product;
};

export default function ProductForm({ form }: ProductFormProps) {
  const { mutate: createProduct } = useCreateProduct();
  const { mutate: editProduct } = useEditProduct();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: form
      ? {
          id: form?.id || "",
          name: form?.name || "",
          list_price: form?.list_price || 0,
          standard_price: form?.standard_price || 0,
          default_code: form?.default_code || "",
          barcode: form?.barcode || "",
        }
      : undefined,
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const payload: Product = {
      ...data,
      default_code: data.default_code || null,
      barcode: data.barcode || null,
    };

    if (form) {
      editProduct(payload);
    } else {
      createProduct(payload);
    }
  };

  return (
    <form
      className="flex flex-col gap-2 pt-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid w-full max-w-sm items-center gap-1.5 m-auto">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name", { required: true })} />
        {errors.name && (
          <p className="text-red-500">{String(errors.name.message)}</p>
        )}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 m-auto">
        <Label htmlFor="salesPrice">Sales Price (DT)</Label>
        <Input
          id="salesPrice"
          type="number"
          step="0.01"
          {...register("list_price")}
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 m-auto">
        <Label htmlFor="cost">Cost (DT)</Label>
        <Input
          id="cost"
          type="number"
          step="0.01"
          {...register("standard_price")}
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 m-auto">
        <Label htmlFor="reference">Reference</Label>
        <Input id="reference" type="text" {...register("default_code")} />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 m-auto">
        <Label htmlFor="barcode">Barcode</Label>
        <Input id="barcode" type="text" {...register("barcode")} />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 m-auto">
        <Input type="submit" className="cursor-pointer mt-3" />
      </div>
    </form>
  );
}
