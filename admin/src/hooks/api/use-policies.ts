import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from ".";
import { toast } from "sonner";

export const useGetPolicyQuery = (propertyId: string) => {
  return useQuery({
    queryKey: ["policy", propertyId],
    queryFn: async () => {
      const response = await api.get(`/properties/${propertyId}/policy`);
      return response.data;
    },
    retry: false,
  });
};

export const useCreateOrUpdatePolicyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, data }: { propertyId: string; data: any }) => {
      const response = await api.post(`/properties/${propertyId}/policy`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Policy saved successfully");
      queryClient.invalidateQueries({ queryKey: ["policy", variables.propertyId] });
    },
    onError: () => {
      toast.error("Failed to save policy");
    },
  });
};
