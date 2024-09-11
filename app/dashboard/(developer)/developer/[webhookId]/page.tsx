"use client";

import { useWebhook } from "@/hooks";
import { Skeleton } from "@nextui-org/react";
import EventsTable from "./events-table";

export default function WebhookPage({
  params: { webhookId },
}: {
  params: { webhookId: string };
}) {
  const { webhook, isPending } = useWebhook(webhookId);

  if (isPending) {
    return (
      <section className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Webhook</h1>
        <Skeleton className="h-10 rounded-lg w-full sm:max-w-[44%]" />

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total 0 events</span>
          <label className="flex items-center text-default-400 text-small">
            Events per page:
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
      <h1 className="text-3xl font-bold">Webhook {webhook.name}</h1>
      <EventsTable events={webhook.eventLogs} />
    </section>
  );
}
