import { useQuery } from "@tanstack/react-query";

export const useUserSubscriptions = (address: string) => {
  const { isPending, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["subscriptions", address],
    queryFn: async () => {
      try {
        const response = await fetch(
          `/api/public/subscriptions?address=${address}`
        );
        return await response.json();
      } catch (error) {
        return [];
      }
    },
  });

  return {
    isPending: isPending || isRefetching,
    error,
    subscriptions: data,
    refetch,
  };
};
