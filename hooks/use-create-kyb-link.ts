import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

export default function useCreateKYBLink() {
  const { getAccessToken } = usePrivy();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const createKYBLink = async () => {
    setLoading(true);
    setError(null);
    const token = await getAccessToken();
    try {
      const res = await fetch(`/api/bridge/kyb`, {
        method: "POST",
        headers: {
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

  return {
    data,
    loading,
    error,
    createKYBLink,
  };
}
