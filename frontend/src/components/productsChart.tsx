import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useProducts } from "@/hooks/useProduct";

export function ProductsChart() {
  const { data: products } = useProducts();
  const chartDataset = products && products.length ? products : [];
  const totalProducts = chartDataset.length;

  return (
    <Card className="flex flex-col    ">
      <CardHeader className="items-center pb-0">
        <CardDescription>Product Overview</CardDescription>
        <CardTitle className="@[230px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {totalProducts}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
