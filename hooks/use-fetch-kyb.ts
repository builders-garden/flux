import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { BridgeKybLink } from "@/lib/bridge/interfaces";

export default function useFetchKYB({ kybLinkId }: { kybLinkId: string }) {
  const { user, getAccessToken } = usePrivy();
  const [data, setData] = useState<BridgeKybLink>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getKYB = async () => {
    setLoading(true);
    setError(null);
    if (!kybLinkId) {
      setLoading(false);
      return;
    }
    const token = await getAccessToken();
    try {
      const res = await fetch(`/api/bridge/kyb/${kybLinkId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setData(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    getKYB();
  }, [user, kybLinkId]);

  const refetch = () => {
    getKYB();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}
