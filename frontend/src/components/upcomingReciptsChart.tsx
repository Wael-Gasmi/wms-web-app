import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { useReceipts } from "@/hooks/useReceipt";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  isAfter,
  isBefore,
  addDays,
  parseISO,
  format,
  eachDayOfInterval,
} from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const chartConfig = {
  date: {
    label: "Date",
    color: "#60a5fa",
  },
  count: {
    label: "Receipts Count",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

type Receipt = {
  name: string;
  scheduled_date: string;
};

export default function UpcomingReciptsChart() {
  const { data: receipts } = useReceipts();

  const today = new Date();
  const nextWeek = addDays(today, 6);

  const allDates = eachDayOfInterval({ start: today, end: nextWeek });
  const emptyData = allDates.map((date) => ({
    date: format(date, "yyyy-MM-dd"),
    count: 0,
  }));

  const receiptCounts =
    receipts
      ?.filter(({ scheduled_date }) => {
        const date = parseISO(scheduled_date);
        return (
          isAfter(date, addDays(today, -1)) &&
          isBefore(date, addDays(nextWeek, 1))
        );
      })
      ?.reduce((acc, { scheduled_date }) => {
        const parsedDate = parseISO(scheduled_date);
        const key = format(parsedDate, "yyyy-MM-dd");
        const existing = acc.find((item) => item.date === key);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ date: key, count: 1 });
        }
        return acc;
      }, [] as { date: string; count: number }[]) ?? [];

  const data = emptyData.map((day) => {
    const found = receiptCounts.find((r) => r.date === day.date);
    return found ?? day;
  });

  return (
    <Card className="flex flex-col  ">
      <CardHeader>
        <CardTitle>Upcoming Receipts</CardTitle>
        <CardDescription>
          Receipts scheduled from today to 7 days ahead
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} barSize={10}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => format(parseISO(value), "MMM d")}
            />
            <YAxis allowDecimals={false} />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          {format(today, "MMM d")} – {format(nextWeek, "MMM d")}
        </div>
      </CardFooter>
    </Card>
  );
}
