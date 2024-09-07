import { PaymentLink, Product, User } from "@prisma/client";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export const usePaymentLink = (slug: string) => {
  const { getAccessToken } = usePrivy();
  const { isPending, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["payment-link", slug],
    queryFn: async () => {
      try {
        const accessToken = await getAccessToken();
        const response = await fetch(`/api/payment-links/${slug}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return await response.json();
      } catch (error) {
        return null;
      }
    },
  });

  return {
    isPending: isPending || isRefetching,
    error,
    paymentLink: data as
      | (PaymentLink & { user: User; product: Product })
      | null,
    refetch,
  };
};
