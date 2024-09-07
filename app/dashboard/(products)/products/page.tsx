import ProductsTable from "./products-table";

export default function ProductsPage() {
  return (
    <section className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold">Products</h1>
      <ProductsTable />
    </section>
  );
}
