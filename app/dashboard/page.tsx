"use client";

import { useStats } from "@/hooks";
import { Card, CardBody, CardHeader, Chip, Skeleton } from "@nextui-org/react";
import "chart.js/auto";
import BalanceCards from "@/components/dashboard/balance-cards";
import Stats from "@/components/dashboard/stats";

export default function Dashboard() {
  const { stats, isPending } = useStats();

  return (
    <section className="flex flex-col space-y-8">
      <BalanceCards />
      <Stats />
    </section>
  );
}
