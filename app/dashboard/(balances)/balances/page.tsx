"use client";

import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

export default function BalancesPage() {
  return (
    <section className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold">Balances</h1>
      <div className="grid grid-cols-2 gap-x-2">
        <Card>
          <CardHeader className="pb-1">USD</CardHeader>
          <CardBody className="text-lg font-bold pt-0">$0.00</CardBody>
        </Card>
        <Card>
          <CardHeader className="pb-1">EUR</CardHeader>
          <CardBody className="text-lg font-bold pt-0">€0.00</CardBody>
        </Card>
      </div>
      <Divider />
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-bold">Payouts</h2>
          <Button color="success">Payout</Button>
        </div>
        <p className="text-xl">
          Transfer your Flux balance to your bank account.
        </p>
      </div>
      <div className="flex flex-col max-w-lg space-y-2">
        <div className="flex flex-row justify-between">
          <p>On the way to your bank account</p>
          <p>$0.00</p>
        </div>
        <div className="flex flex-row justify-between">
          <p>Sent to your bank account</p>
          <p>$0.00</p>
        </div>
        <Divider className="max-w-lg" />
        <div className="flex flex-row justify-between">
          <p className="font-bold">Total</p>
          <p className="font-bold">$0.00</p>
        </div>
      </div>
    </section>
  );
}
