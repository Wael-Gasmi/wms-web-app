import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocations } from "@/hooks/useLocation";

import { useProducts } from "@/hooks/useProduct";

export function ProductsChart() {
  const { data: products } = useProducts();
  const { data: locations } = useLocations();
  const chartDataset = products && products.length ? products : [];
  const totalProducts = chartDataset.length;
  const totalQuantity = chartDataset.reduce(
    (acc, product) => acc + (product.virtual_available || 0),
    0
  );
  const totalLocation = locations && locations.length ? locations.length : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-center gap-4">
        <Card className="flex flex-col   w-full h-full ">
          <CardHeader className="items-center pb-0">
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="@[230px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {totalProducts}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="flex flex-col w-full h-full   ">
          <CardHeader className="items-center pb-0">
            <CardDescription>Total Quantities</CardDescription>
            <CardTitle className="@[230px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {totalQuantity}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="flex w-full items-center justify-center gap-4">
        <Card className="flex flex-col   w-full h-full ">
          <CardHeader className="items-center pb-0">
            <CardDescription>Total Locations</CardDescription>
            <CardTitle className="@[230px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {totalLocation}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
