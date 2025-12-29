import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export type Donation = {
  id: string;
  user_id: string | null;
  campaign_id: string;
  amount: number;
  donor_name: string | null;
  donor_email: string | null;
  payment_status: string;
  receipt_number: string;
  created_at: string;
  campaign?: {
    title: string;
  };
};

export function useDonations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["donations", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("donations")
        .select(`
          *,
          campaign:campaigns(title)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Donation[];
    },
    enabled: !!user,
  });
}

export function useCreateDonation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      campaignId,
      amount,
      donorName,
      donorEmail,
    }: {
      campaignId: string;
      amount: number;
      donorName: string;
      donorEmail: string;
    }) => {
      const { data, error } = await supabase
        .from("donations")
        .insert([{
          user_id: user?.id,
          campaign_id: campaignId,
          amount,
          donor_name: donorName,
          donor_email: donorEmail,
          payment_status: "completed",
        }])
        .select()
        .single();

      if (error) throw error;
      return data as Donation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast({
        title: "Donation successful!",
        description: "Thank you for your generous contribution.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Donation failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
}
