import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from ".";
import { toast } from "sonner";
import { useAuthSession } from "../use-auth-session";

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

export const useGetHighlightsQuery = (propertyId: string) => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<{ data: Highlight[]; success: boolean }>({
    queryKey: ["highlights", propertyId],
    enabled: isAuthenticated && !!propertyId,
    retry: false,
    queryFn: async () => {
      const response = await api.get(`/properties/${propertyId}/highlights`);
      return response.data;
    },
  });
};

export const useAddHighlightMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { propertyId: string; data: Partial<Highlight> }>({
    mutationFn: async ({ propertyId, data }) => {
      const response = await api.post(`/properties/${propertyId}/highlights`, data);
      return response.data;
    },
    onSuccess: ({ message }, { propertyId }) => {
      toast.success(message || "Highlight added");
      queryClient.invalidateQueries({ queryKey: ["highlights", propertyId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error?.message || "Failed to add highlight");
    },
  });
};

export const useUpdateHighlightMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { id: string; propertyId: string; data: Partial<Highlight> }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/highlights/${id}`, data);
      return response.data;
    },
    onSuccess: ({ message }, { propertyId }) => {
      toast.success(message || "Highlight updated");
      queryClient.invalidateQueries({ queryKey: ["highlights", propertyId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error?.message || "Failed to update highlight");
    },
  });
};

export const useDeleteHighlightMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { id: string; propertyId: string }>({
    mutationFn: async ({ id }) => {
      const response = await api.delete(`/highlights/${id}`);
      return response.data;
    },
    onSuccess: ({ message }, { propertyId }) => {
      toast.success(message || "Highlight deleted");
      queryClient.invalidateQueries({ queryKey: ["highlights", propertyId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error?.message || "Failed to delete highlight");
    },
  });
};
