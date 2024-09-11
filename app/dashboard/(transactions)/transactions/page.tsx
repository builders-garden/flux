"use client";

import { Skeleton } from "@nextui-org/react";
import TransactionsTable from "./transactions-table";
import { useTransactions } from "@/hooks";

export default function TransactionsPage() {
  const { isPending, data, page, limit, setPage, setLimit } = useTransactions();

  if (isPending) {
    return (
      <section className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Skeleton className="h-10 rounded-lg w-full sm:max-w-[44%]" />

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total 0 transactions
          </span>
          <label className="flex items-center text-default-400 text-small">
            Transactions per page:
            <select className="bg-transparent outline-none text-default-400 text-small">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
        <Skeleton className="h-[300px] rounded-lg w-full" />
      </section>
    );
  }
  return (
    <section className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold">Transactions</h1>
      <TransactionsTable
        data={data!}
        page={page}
        rowsPerPage={limit}
        setPage={setPage}
        setRowsPerPage={setLimit}
      />
    </section>
  );
}
