import { useState } from "react";
import { Layout } from "@/components/Layout";
import { CampaignCard } from "@/components/CampaignCard";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Loader2 } from "lucide-react";

export default function Campaigns() {
  const [search, setSearch] = useState("");
  const [urgency, setUrgency] = useState("all");
  const [category, setCategory] = useState("all");
  
  const { data: campaigns, isLoading } = useCampaigns(search, urgency, category);

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl font-bold mb-4">Active Campaigns</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse through our active campaigns and find a cause that resonates with you.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="supplies">Supplies</SelectItem>
                </SelectContent>
              </Select>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Campaigns Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">No campaigns found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
