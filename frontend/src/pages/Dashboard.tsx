import { ProductsChart } from "@/components/productsChart";
import { Separator } from "@/components/ui/separator";
import UpcomingDeliveriesChart from "@/components/UpcomingDeliveriesChart";
import UpcomingReciptsChart from "@/components/upcomingReciptsChart";
import { UsersChart } from "@/components/usersChart";

export default function Dashboard() {
  const cardClass =
    "*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6 w-1/3";

  return (
    <div className="container mx-auto py-10 px-5 w-full">
      <h1 className="text-2xl font-bold tracking-tighter">Dashboard</h1>
      <Separator className="my-5" />
      <div className="flex  justify-evenly  w-full  flex-wrap">
        <div className={cardClass}>
          <UpcomingReciptsChart />
        </div>
        <div className={cardClass}>
          <UpcomingDeliveriesChart />
        </div>
        <div className={cardClass}>
          <UsersChart />
          <ProductsChart />
        </div>
      </div>
    </div>
  );
}
