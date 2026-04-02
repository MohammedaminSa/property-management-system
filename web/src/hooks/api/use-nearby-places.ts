import { useQuery } from "@tanstack/react-query";
import { api } from ".";

interface NearbyPlace {
  id: string;
  name: string;
  category: "ATTRACTION" | "TRANSPORT" | "RESTAURANT";
  distance: string;
  icon?: string;
  order: number;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useGetNearbyPlaces = (propertyId: string) => {
  return useQuery<{ data: NearbyPlace[]; success: boolean }>({
    queryKey: ["nearby-places", propertyId],
    enabled: !!propertyId,
    retry: false,
    queryFn: async () => {
      const response = await api.get(`/properties/${propertyId}/nearby-places`);
      return response.data;
    },
  });
};
