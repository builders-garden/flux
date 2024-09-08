import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

export default function useCreateBankAccount({
  customerId,
}: {
  customerId: string;
}) {
  const { getAccessToken } = usePrivy();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const createBankAccount = async (accountData: {
    accountNumber: string;
    bic: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
  }) => {
    setLoading(true);
    setError(null);
    const token = await getAccessToken();
    try {
      const res = await fetch(
        `/api/bridge/customers/${customerId}/external-accounts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(accountData),
        }
      );
      const data = await res.json();
      setData(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    createBankAccount,
  };
}
