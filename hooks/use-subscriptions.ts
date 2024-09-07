import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export const useSubscriptions = () => {
  const { getAccessToken } = usePrivy();
  const { isPending, error, data } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      try {
        const accessToken = await getAccessToken();
        const response = await fetch("/api/subscriptions", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return await response.json();
      } catch (error) {
        return [];
      }
    },
  });

  return { isPending, error, subscriptions: data };
};
