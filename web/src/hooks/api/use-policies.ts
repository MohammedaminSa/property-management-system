import { useQuery } from "@tanstack/react-query";
import { api } from ".";

export const useGetPolicy = (propertyId: string) => {
  return useQuery({
    queryKey: ["policy", propertyId],
    queryFn: async () => {
      const response = await api.get(`/properties/${propertyId}/policy`);
      return response.data;
    },
    retry: false,
    enabled: !!propertyId,
  });
};
