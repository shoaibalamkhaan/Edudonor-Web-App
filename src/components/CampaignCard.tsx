import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Campaign } from "@/hooks/useCampaigns";
import { Heart, Target, Clock } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
}

const urgencyLabels: Record<Campaign["urgency"], string> = {
  low: "Low Urgency",
  medium: "Medium",
  high: "High Priority",
  critical: "Critical",
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = Math.min((campaign.raised_amount / campaign.target_amount) * 100, 100);
  const remaining = campaign.target_amount - campaign.raised_amount;

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/50 bg-card">
      {/* Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {campaign.image_url ? (
          <img
            src={campaign.image_url}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-hero">
            <Heart className="h-16 w-16 text-primary-foreground/50" />
          </div>
        )}
        
        {/* Urgency Badge */}
        <Badge 
          variant={campaign.urgency as any}
          className="absolute top-3 right-3"
        >
          <Clock className="h-3 w-3 mr-1" />
          {urgencyLabels[campaign.urgency]}
        </Badge>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Title & Description */}
        <div>
          <h3 className="font-serif text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {campaign.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {campaign.description}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Progress 
            value={progress} 
            className="h-2"
            indicatorClassName={progress >= 100 ? "bg-success" : ""}
          />
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-primary">
              Rs. {campaign.raised_amount.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              of Rs. {campaign.target_amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            {progress >= 100 ? "Goal Reached!" : `Rs. ${remaining.toLocaleString()} to go`}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button asChild className="w-full" variant={campaign.urgency === "critical" ? "warm" : "default"}>
          <Link to={`/donate/${campaign.id}`}>
            <Heart className="h-4 w-4 mr-2" />
            Donate Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
