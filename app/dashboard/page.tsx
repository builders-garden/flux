import { Card, CardBody, Chip } from "@nextui-org/react";
import Link from "next/link";

export default function Dashboard() {
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
    </section>
  );
}
