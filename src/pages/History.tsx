import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDonations } from "@/hooks/useDonations";
import { Loader2, Heart, Download, Receipt, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function History() {
  const { data: donations, isLoading } = useDonations();

  const generateReceipt = (donation: any) => {
    const receiptContent = `
╔════════════════════════════════════════════╗
║            EDUDONOR DONATION RECEIPT        ║
╠════════════════════════════════════════════╣
║                                             ║
║  Receipt Number: ${donation.receipt_number.padEnd(25)}║
║  Date: ${format(new Date(donation.created_at), "MMMM dd, yyyy").padEnd(35)}║
║                                             ║
║  Donor: ${(donation.donor_name || "Anonymous").padEnd(34)}║
║  Email: ${(donation.donor_email || "N/A").padEnd(34)}║
║                                             ║
║  Campaign: ${(donation.campaign?.title || "N/A").slice(0, 31).padEnd(31)}║
║                                             ║
║  Amount Donated: Rs. ${donation.amount.toLocaleString().padEnd(21)}║
║  Payment Status: ${donation.payment_status.padEnd(25)}║
║                                             ║
╠════════════════════════════════════════════╣
║  Thank you for your generous contribution!  ║
║  Your donation makes education accessible.  ║
╚════════════════════════════════════════════╝
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EduDonor-Receipt-${donation.receipt_number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const totalDonated = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold mb-2">My Donations</h1>
            <p className="text-muted-foreground">Track your giving history and download receipts</p>
          </div>

          {/* Summary Card */}
          <Card className="mb-8 bg-gradient-hero text-primary-foreground">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm mb-1">Total Donated</p>
                  <p className="text-3xl font-bold">Rs. {totalDonated.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary-foreground/80 text-sm mb-1">Donations Made</p>
                  <p className="text-3xl font-bold">{donations?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donations List */}
          {donations && donations.length > 0 ? (
            <div className="space-y-4">
              {donations.map((donation) => (
                <Card key={donation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Heart className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">{donation.campaign?.title || "Campaign"}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(donation.created_at), "MMM dd, yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Receipt className="h-3 w-3" />
                              {donation.receipt_number}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">Rs. {Number(donation.amount).toLocaleString()}</p>
                          <Badge variant="success" className="text-xs">
                            {donation.payment_status}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => generateReceipt(donation)}
                          title="Download Receipt"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No donations yet</h3>
                <p className="text-muted-foreground mb-6">Start making a difference by donating to a campaign</p>
                <Button asChild>
                  <Link to="/campaigns">Browse Campaigns</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
