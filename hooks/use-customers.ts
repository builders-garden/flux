import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export const useCustomers = () => {
  const { getAccessToken } = usePrivy();
  const { isPending, error, data } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      try {
        const accessToken = await getAccessToken();
        const response = await fetch("/api/customers", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const { customers } = await response.json();
        return customers;
      } catch (error) {
        return [];
      }
    },
  });

  return { isPending, error, customers: data };
};
