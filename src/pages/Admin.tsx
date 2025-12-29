import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAllCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign, Campaign } from "@/hooks/useCampaigns";
import { Loader2, Plus, Pencil, Trash2, DollarSign, Target, Users } from "lucide-react";

const urgencyOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

type FormData = {
  title: string;
  description: string;
  category: Campaign["category"];
  target_amount: number;
  urgency: Campaign["urgency"];
  image_url: string;
  is_active: boolean;
};

const emptyForm: FormData = {
  title: "",
  description: "",
  category: "education",
  target_amount: 5000,
  urgency: "medium",
  image_url: "",
  is_active: true,
};

export default function Admin() {
  const { data: campaigns, isLoading } = useAllCampaigns();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (campaign: Campaign) => {
    setFormData({
      title: campaign.title,
      description: campaign.description,
      category: campaign.category,
      target_amount: campaign.target_amount,
      urgency: campaign.urgency,
      image_url: campaign.image_url || "",
      is_active: campaign.is_active,
    });
    setEditingId(campaign.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await updateCampaign.mutateAsync({ id: editingId, ...formData });
    } else {
      await createCampaign.mutateAsync(formData);
    }
    
    setIsDialogOpen(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteCampaign.mutateAsync(id);
    setDeleteConfirmId(null);
  };

  const totalRaised = campaigns?.reduce((sum, c) => sum + c.raised_amount, 0) || 0;
  const activeCampaigns = campaigns?.filter(c => c.is_active).length || 0;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Admin Panel</h1>
              <p className="text-muted-foreground">Manage donation campaigns</p>
            </div>
            <Button onClick={handleOpenCreate} variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="py-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Campaigns</p>
                  <p className="text-2xl font-bold">{campaigns?.length || 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Campaigns</p>
                  <p className="text-2xl font-bold">{activeCampaigns}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Raised</p>
                  <p className="text-2xl font-bold">Rs. {totalRaised.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Campaigns</CardTitle>
              <CardDescription>View and manage all donation campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {campaigns && campaigns.length > 0 ? (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{campaign.title}</h3>
                          {!campaign.is_active && <Badge variant="secondary">Inactive</Badge>}
                          <Badge variant={campaign.urgency as any}>{campaign.urgency}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Rs. {campaign.raised_amount.toLocaleString()} / Rs. {campaign.target_amount.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(campaign)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmId(campaign.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No campaigns yet. Create your first campaign to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingId ? "Edit Campaign" : "Create Campaign"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update campaign details below" : "Fill in the details to create a new campaign"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Urgency</Label>
              <Select value={formData.urgency} onValueChange={(v) => setFormData({ ...formData, urgency: v as Campaign["urgency"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {urgencyOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Amount (Rs.)</Label>
              <Input type="number" min="100" value={formData.target_amount} onChange={(e) => setFormData({ ...formData, target_amount: parseFloat(e.target.value) })} required />
            </div>
            <div className="space-y-2">
              <Label>Image URL (optional)</Label>
              <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createCampaign.isPending || updateCampaign.isPending}>
                {(createCampaign.isPending || updateCampaign.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? "Save Changes" : "Create Campaign"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign?</DialogTitle>
            <DialogDescription>This action cannot be undone. All donation records will remain but the campaign will be permanently deleted.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)} disabled={deleteCampaign.isPending}>
              {deleteCampaign.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
