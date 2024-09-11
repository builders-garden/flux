import { useStats } from "@/hooks";
import { Card, CardHeader, CardBody, Skeleton } from "@nextui-org/react";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";

export default function Stats() {
  const { stats, isPending } = useStats();

  const { labels, datasets } = useMemo(() => {
    if (!stats) {
      return { labels: [], datasets: [] };
    }

    // map the labels to the date of the transaction in format DD/MM/YYYY
    const labels = stats.transactions.map((t) =>
      new Date(t.date).toLocaleDateString()
    );

    const datasets = [
      {
        label: "Volume ($)",
        // calculate the data by summing the amount of each transaction for each day
        data: stats.transactions.map((t) => t.totalAmount),
        fill: false,
        backgroundColor: "rgb(54, 162, 235)", // A nice blue color
        tension: 0.1,
      },
      {
        label: "Transactions",
        data: stats.transactions.map((t) => t.count),
        fill: false,
        backgroundColor: "rgb(255, 99, 132)", // A nice pink/red color
        tension: 0.1,
      },
    ];

    return { labels, datasets };
  }, [stats]);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl font-bold">Stats</div>
      <div className="grid grid-cols-4 grid-rows-3 gap-4">
        <div className="col-span-2 row-span-3">
          <Card className="h-full">
            <CardHeader>
              <h2>Recent Transactions</h2>
            </CardHeader>
            <CardBody>
              <div
                style={{ width: "500px", height: "250px" }}
                className="mx-auto"
              >
                <Line data={{ labels, datasets }} />
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="col-span-2 row-span-1">
          <Card>
            <CardHeader>
              <h2>Customers</h2>
            </CardHeader>
            <CardBody>
              {isPending ? (
                <Skeleton className="bg-gray-300 rounded-lg h-8 w-24" />
              ) : (
                <p className="text-3xl font-bold">
                  {stats ? stats.numCustomers : "0"}
                </p>
              )}
            </CardBody>
          </Card>
        </div>
        <div className="col-span-2 row-span-1">
          <Card>
            <CardHeader>
              <h2>Products</h2>
            </CardHeader>
            <CardBody>
              {isPending ? (
                <Skeleton className="bg-gray-300 rounded-lg h-8 w-24" />
              ) : (
                <p className="text-3xl font-bold">
                  {stats ? stats.numProducts : "0"}
                </p>
              )}
            </CardBody>
          </Card>
        </div>
        <div className="col-span-2 row-span-1">
          <Card>
            <CardHeader>
              <h2>Subscriptions</h2>
            </CardHeader>
            <CardBody>
              {isPending ? (
                <Skeleton className="bg-gray-300 rounded-lg h-8 w-24" />
              ) : (
                <p className="text-3xl font-bold">
                  {stats ? stats.numSubscriptions : "0"}
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
