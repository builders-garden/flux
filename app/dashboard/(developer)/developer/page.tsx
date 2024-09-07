"use client";

import { useWebhooks } from "@/hooks";
import { Skeleton } from "@nextui-org/react";
import WebhooksTable from "./webhooks-table";

export default function DeveloperPage() {
  const { isPending, webhooks, refetch } = useWebhooks();

  if (isPending) {
    return (
      <section className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Webhooks</h1>
        <Skeleton className="h-10 rounded-lg w-full sm:max-w-[44%]" />

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total 0 webhooks</span>
          <label className="flex items-center text-default-400 text-small">
            Webhooks per page:
            <select className="bg-transparent outline-none text-default-400 text-small">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
        <Skeleton className="h-[300px] rounded-lg w-full" />
      </section>
    );
  }

  return (
    <section className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold">Webhooks</h1>
      <WebhooksTable webhooks={webhooks} refetch={refetch} />
    </section>
  );
}
