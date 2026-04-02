import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from ".";
import { toast } from "sonner";
import { useAuthSession } from "../use-auth-session";

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

export const useGetNearbyPlacesQuery = (propertyId: string) => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<{ data: NearbyPlace[]; success: boolean }>({
    queryKey: ["nearby-places", propertyId],
    enabled: isAuthenticated && !!propertyId,
    retry: false,
    queryFn: async () => {
      const response = await api.get(`/properties/${propertyId}/nearby-places`);
      return response.data;
    },
  });
};

export const useAddNearbyPlaceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { propertyId: string; data: Partial<NearbyPlace> }>({
    mutationFn: async ({ propertyId, data }) => {
      const response = await api.post(`/properties/${propertyId}/nearby-places`, data);
      return response.data;
    },
    onSuccess: ({ message }, { propertyId }) => {
      toast.success(message || "Nearby place added");
      queryClient.invalidateQueries({ queryKey: ["nearby-places", propertyId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error?.message || "Failed to add nearby place");
    },
  });
};

export const useUpdateNearbyPlaceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { id: string; propertyId: string; data: Partial<NearbyPlace> }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/nearby-places/${id}`, data);
      return response.data;
    },
    onSuccess: ({ message }, { propertyId }) => {
      toast.success(message || "Nearby place updated");
      queryClient.invalidateQueries({ queryKey: ["nearby-places", propertyId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error?.message || "Failed to update nearby place");
    },
  });
};

export const useDeleteNearbyPlaceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { id: string; propertyId: string }>({
    mutationFn: async ({ id }) => {
      const response = await api.delete(`/nearby-places/${id}`);
      return response.data;
    },
    onSuccess: ({ message }, { propertyId }) => {
      toast.success(message || "Nearby place deleted");
      queryClient.invalidateQueries({ queryKey: ["nearby-places", propertyId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error?.message || "Failed to delete nearby place");
    },
  });
};
