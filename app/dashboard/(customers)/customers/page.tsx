import CustomersTable from "./customers-table";

export default function CustomersPage() {
  return (
    <section className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold">Customers</h1>
      <CustomersTable />
    </section>
  );
}
