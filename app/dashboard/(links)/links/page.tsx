import LinksTable from "./links-table";

export default function PaymentLinksPage() {
  return (
    <section className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold">Payment Links</h1>
      <LinksTable />
    </section>
  );
}
