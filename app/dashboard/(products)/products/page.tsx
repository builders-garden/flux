"use client";

import { usePrivy } from "@privy-io/react-auth";
import ProductsTable from "./products-table";
import { useEffect, useState } from "react";
import { Skeleton } from "@nextui-org/react";

export default function ProductsPage() {
  const { getAccessToken } = usePrivy();
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await fetch("/api/products", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const products = await response.json();
      setProducts(products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 rounded-lg w-full sm:max-w-[44%]" />
          <Skeleton className="h-10 rounded-lg w-36" />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total 0 products</span>
          <label className="flex items-center text-default-400 text-small">
            Products per page:
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
      <h1 className="text-3xl font-bold">Products</h1>
      <ProductsTable products={products} />
    </section>
  );
}
