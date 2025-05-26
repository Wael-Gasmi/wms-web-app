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

  return (
    <Card className="flex flex-col   ">
      <CardHeader className="items-center pb-0">
        <CardDescription>User Overview</CardDescription>
        <CardTitle className="@[230px]/card:text-3xl text-2xl font-semibold tabular-nums ">
          {totalUsers}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
