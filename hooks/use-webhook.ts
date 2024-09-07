import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export const useWebhook = (webhookId: string) => {
  const { getAccessToken } = usePrivy();
  const { isPending, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["webhooks", webhookId],
    queryFn: async () => {
      try {
        const accessToken = await getAccessToken();
        const response = await fetch(`/api/webhooks/${webhookId}`, {
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

  return {
    isPending: isPending || isRefetching,
    error,
    webhook: data,
    refetch,
  };
};
