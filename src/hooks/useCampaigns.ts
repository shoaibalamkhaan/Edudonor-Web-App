import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type Campaign = {
  id: string;
  title: string;
  description: string;
  category: "education" | "emergency" | "scholarship" | "infrastructure" | "supplies" | "other";
  target_amount: number;
  raised_amount: number;
  urgency: "low" | "medium" | "high" | "critical";
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export function useCampaigns(searchQuery?: string, urgencyFilter?: string, categoryFilter?: string) {
  return useQuery({
    queryKey: ["campaigns", searchQuery, urgencyFilter, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from("campaigns")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (urgencyFilter && urgencyFilter !== "all") {
        query = query.eq("urgency", urgencyFilter as Campaign["urgency"]);
      }

      if (categoryFilter && categoryFilter !== "all") {
        query = query.eq("category", categoryFilter as Campaign["category"]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Campaign[];
    },
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Campaign | null;
    },
    enabled: !!id,
  });
}

export function useAllCampaigns() {
  return useQuery({
    queryKey: ["all-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Campaign[];
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (campaign: Omit<Campaign, "id" | "created_at" | "updated_at" | "raised_amount">) => {
      const { data, error } = await supabase
        .from("campaigns")
        .insert([{ ...campaign, raised_amount: 0 }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["all-campaigns"] });
      toast({
        title: "Campaign created",
        description: "The campaign has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Campaign> & { id: string }) => {
      const { data, error } = await supabase
        .from("campaigns")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["all-campaigns"] });
      toast({
        title: "Campaign updated",
        description: "The campaign has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update campaign",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["all-campaigns"] });
      toast({
        title: "Campaign deleted",
        description: "The campaign has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete campaign",
        variant: "destructive",
      });
    },
  });
}
