import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

export default function useDeleteBankAccount({
  customerId,
  externalAccountId,
}: {
  customerId: string;
  externalAccountId: string;
}) {
  const { getAccessToken } = usePrivy();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deleteBankAccount = async () => {
    setLoading(true);
    setError(null);
    const token = await getAccessToken();
    try {
      const res = await fetch(
        `/api/bridge/customers/${customerId}/external-accounts/${externalAccountId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    deleteBankAccount,
  };
}
