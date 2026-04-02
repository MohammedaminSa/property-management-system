import { useQuery } from "@tanstack/react-query";
import { api } from ".";

interface Highlight {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useGetHighlights = (propertyId: string) => {
  return useQuery<{ data: Highlight[]; success: boolean }>({
    queryKey: ["highlights", propertyId],
    enabled: !!propertyId,
    retry: false,
    queryFn: async () => {
      const response = await api.get(`/properties/${propertyId}/highlights`);
      return response.data;
    },
  });
};
