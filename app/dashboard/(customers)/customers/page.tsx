"use client";
import { Skeleton } from "@nextui-org/react";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import CustomersTable from "./customers-table";

export default function CustomersPage() {
  const { getAccessToken } = usePrivy();
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await fetch("/api/customers", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const customers = await response.json();
      setUsers(customers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Skeleton className="h-10 rounded-lg w-full sm:max-w-[44%]" />

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total 0 customers</span>
          <label className="flex items-center text-default-400 text-small">
            Customers per page:
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
      <h1 className="text-3xl font-bold">Customers</h1>
      <CustomersTable users={users} />
    </section>
  );
}
