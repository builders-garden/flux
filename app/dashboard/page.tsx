"use client";

import { useStats } from "@/hooks";
import { Card, CardBody, CardHeader, Chip, Skeleton } from "@nextui-org/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "chart.js/auto";
import { useMemo } from "react";

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

export default function Dashboard() {
  const { stats, isPending } = useStats();
  console.log(stats);

  const { labels, datasets } = useMemo(() => {
    if (!stats) {
      return { labels: [], datasets: [] };
    }

    // map the labels to the date of the transaction in format DD/MM/YYYY
    const labels = stats.transactions.map((t) =>
      new Date(t.createdAt).toLocaleDateString()
    );

    const datasets = [
      {
        label: "Volume ($)",
        // calculate the data by summing the amount of each transaction for each day
        data: stats.transactions.map((t) =>
          stats.transactions
            .filter(
              (t2) =>
                new Date(t2.createdAt).toLocaleDateString() ===
                new Date(t.createdAt).toLocaleDateString()
            )
            .reduce((acc, t2) => acc + parseFloat(t2.amount), 0)
        ),
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ];

    return { labels, datasets };
  }, [stats]);

  console.log(labels, datasets);

  return (
    <section className="flex flex-col space-y-4">
      <Card>
        <CardBody className="p-8 space-y-4">
          <h1 className="text-3xl font-bold">Get started with Flux</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col space-y-2">
              <Chip color="warning" size="sm">
                No code
              </Chip>
              <h2 className="font-bold">Create a product</h2>
              <Link
                className="text-sm text-blue-500 hover:text-blue-800"
                href={`/dashboard/products`}
              >
                Start -&gt;
              </Link>
            </div>
            <div className="flex flex-col space-y-2">
              <Chip color="warning" size="sm">
                No code
              </Chip>
              <h2 className="font-bold">Create a payment link</h2>
              <Link
                className="text-sm text-blue-500 hover:text-blue-800"
                href={`/dashboard/link`}
              >
                Start -&gt;
              </Link>
            </div>
            <div className="flex flex-col space-y-2">
              <Chip color="warning" size="sm">
                No code
              </Chip>
              <h2 className="font-bold">Perform a Payout</h2>
              <Link
                className="text-sm text-blue-500 hover:text-blue-800"
                href={`/dashboard/balances`}
              >
                Start -&gt;
              </Link>
            </div>
            <div className="flex flex-col space-y-2">
              <Chip color="success" size="sm">
                Developers
              </Chip>
              <h2 className="font-bold">Create a webhook</h2>
              <Link
                className="text-sm text-blue-500 hover:text-blue-800"
                href={`/dashboard/settings`}
              >
                Start -&gt;
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
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
        <div className="col-span-1 row-span-1">
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
        <div className="col-span-1 row-span-1">
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
        <div className="col-span-1 row-span-1">
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
        <div className="col-span-1 row-span-1">
          <Card>
            <CardHeader>
              <h2>Volume (USD)</h2>
            </CardHeader>
            <CardBody>
              {isPending ? (
                <Skeleton className="bg-gray-300 rounded-lg h-8 w-24" />
              ) : (
                <p className="text-3xl font-bold">
                  {stats ? `$${stats.totalAmount.toFixed(2)}` : "$0.00"}
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
