"use client";
import { Skeleton } from "@nextui-org/react";
import LinksTable from "./links-table";
import { usePaymentLinks } from "@/hooks";

export default function PaymentLinksPage() {
  const { isPending, links } = usePaymentLinks();

  if (isPending) {
    return (
      <section className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Payment Links</h1>
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 rounded-lg w-full sm:max-w-[44%]" />
          <Skeleton className="h-10 rounded-lg w-36" />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total 0 links</span>
          <label className="flex items-center text-default-400 text-small">
            Links per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              // onChange={onRowsPerPageChange}
            >
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
      <h1 className="text-3xl font-bold">Payment Links</h1>
      <LinksTable links={links} />
    </section>
  );
}
