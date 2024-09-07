import TransactionsTable from "./transactions-table";

export default function TransactionsPage() {
  return (
    <section className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold">Transactions</h1>
      <TransactionsTable />
    </section>
  );
}
