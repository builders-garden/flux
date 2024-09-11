import { BridgeExternalAccountCamel } from "./../lib/bridge/interfaces";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect, useCallback } from "react";

export default function useFetchBankAccount({
  customerId,
  externalAccountId,
}: {
  customerId: string;
  externalAccountId: string;
}) {
  const { user, getAccessToken } = usePrivy();
  const [data, setData] = useState<BridgeExternalAccountCamel>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBankAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!externalAccountId || !customerId) {
      setLoading(false);
      return;
    }
    const token = await getAccessToken();
    try {
      const res = await fetch(
        `/api/bridge/customers/${customerId}/external-accounts/${externalAccountId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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
  }, [externalAccountId, customerId, getAccessToken]);

  useEffect(() => {
    if (!user) return;
    getBankAccount();
  }, [user, externalAccountId, customerId, getBankAccount]);

  const refetch = () => {
    getBankAccount();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}
