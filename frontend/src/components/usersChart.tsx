import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUsers } from "@/hooks/useData";

export function UsersChart() {
  const { data: users } = useUsers();
  const chartDataset = users?.length ? users : [];
  const totalUsers = chartDataset.length;
  const userActive = chartDataset.reduce(
    (acc, user) => acc + (user.isActive || 0),
    0
  );
  return (
    <div className="flex w-full   items-center justify-center gap-4">
      <Card className="flex flex-col  w-full h-full ">
        <CardHeader className="items-center pb-0">
          <CardDescription>Totals Users</CardDescription>
          <CardTitle className="@[230px]/card:text-3xl text-2xl font-semibold tabular-nums ">
            {totalUsers}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="flex flex-col   w-full h-full ">
        <CardHeader className="items-center pb-0">
          <CardDescription>Online Users</CardDescription>
          <CardTitle className="@[230px]/card:text-3xl text-2xl font-semibold tabular-nums ">
            {userActive}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
