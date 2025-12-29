import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCampaign } from "@/hooks/useCampaigns";
import { useCreateDonation } from "@/hooks/useDonations";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart, CreditCard, Check, ArrowLeft } from "lucide-react";
import { z } from "zod";

const donationSchema = z.object({
  amount: z.number().min(1, "Minimum donation is $1"),
  donorName: z.string().min(2, "Name is required"),
  donorEmail: z.string().email("Valid email is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Enter a valid 16-digit card number"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Enter expiry as MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "Enter a valid CVV"),
});

const presetAmounts = [10, 25, 50, 100, 250, 500];

export default function Donate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: campaign, isLoading: campaignLoading } = useCampaign(id || "");
  const createDonation = useCreateDonation();

  const [step, setStep] = useState<"amount" | "payment" | "success">("amount");
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState(user?.user_metadata?.full_name || "");
  const [donorEmail, setDonorEmail] = useState(user?.email || "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");

  if (campaignLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!campaign) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Campaign not found</h2>
            <Button onClick={() => navigate("/campaigns")}>Browse Campaigns</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const progress = Math.min((campaign.raised_amount / campaign.target_amount) * 100, 100);

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    }
  };

  const handlePayment = async () => {
    setErrors({});
    
    try {
      donationSchema.parse({
        amount,
        donorName,
        donorEmail,
        cardNumber: cardNumber.replace(/\s/g, ""),
        expiry,
        cvv,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) fieldErrors[error.path[0] as string] = error.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to make a donation.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const result = await createDonation.mutateAsync({
        campaignId: campaign.id,
        amount,
        donorName,
        donorEmail,
      });
      
      setReceiptNumber(result.receipt_number);
      setStep("success");
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/campaigns")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Campaign Summary */}
            <div className="md:col-span-2">
              <Card>
                <div className="h-40 bg-gradient-hero rounded-t-lg flex items-center justify-center">
                  {campaign.image_url ? (
                    <img src={campaign.image_url} alt={campaign.title} className="w-full h-full object-cover rounded-t-lg" />
                  ) : (
                    <Heart className="h-16 w-16 text-primary-foreground/50" />
                  )}
                </div>
                <CardContent className="p-4 space-y-4">
                  <Badge variant="outline" className="text-xs">{campaign.category}</Badge>
                  <h3 className="font-serif text-lg font-semibold">{campaign.title}</h3>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-primary">${campaign.raised_amount.toLocaleString()}</span>
                    <span className="text-muted-foreground">of ${campaign.target_amount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Donation Form */}
            <div className="md:col-span-3">
              {step === "amount" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Choose Amount</CardTitle>
                    <CardDescription>Select or enter your donation amount</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-3">
                      {presetAmounts.map((preset) => (
                        <Button
                          key={preset}
                          variant={amount === preset && !customAmount ? "default" : "outline"}
                          onClick={() => handleAmountSelect(preset)}
                          className="h-12"
                        >
                          ${preset}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Custom Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={(e) => handleCustomAmount(e.target.value)}
                          className="pl-7"
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-muted-foreground">Donation Amount</span>
                        <span className="text-2xl font-bold text-primary">${amount.toLocaleString()}</span>
                      </div>
                      <Button className="w-full" size="lg" variant="hero" onClick={() => setStep("payment")}>
                        Continue to Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === "payment" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Payment Details</CardTitle>
                    <CardDescription>Enter your payment information (Demo - No real charges)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="John Doe" />
                        {errors.donorName && <p className="text-sm text-destructive">{errors.donorName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} placeholder="john@example.com" />
                        {errors.donorEmail && <p className="text-sm text-destructive">{errors.donorEmail}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                          placeholder="4242 4242 4242 4242"
                          className="pl-10"
                        />
                      </div>
                      {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry</Label>
                        <Input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} />
                        {errors.expiry && <p className="text-sm text-destructive">{errors.expiry}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input type="password" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="•••" maxLength={4} />
                        {errors.cvv && <p className="text-sm text-destructive">{errors.cvv}</p>}
                      </div>
                    </div>
                    <div className="pt-4 border-t flex gap-3">
                      <Button variant="outline" onClick={() => setStep("amount")} disabled={isProcessing}>
                        Back
                      </Button>
                      <Button className="flex-1" variant="hero" onClick={handlePayment} disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>Donate ${amount.toLocaleString()}</>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      🔒 This is a demo. No real payment will be processed.
                    </p>
                  </CardContent>
                </Card>
              )}

              {step === "success" && (
                <Card className="text-center">
                  <CardContent className="pt-10 pb-8 space-y-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="h-8 w-8 text-success" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold mb-2">Thank You!</h2>
                      <p className="text-muted-foreground">Your donation of <strong>${amount.toLocaleString()}</strong> has been processed successfully.</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Receipt Number</p>
                      <p className="font-mono font-semibold">{receiptNumber}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button onClick={() => navigate("/history")}>View My Donations</Button>
                      <Button variant="outline" onClick={() => navigate("/campaigns")}>Browse More Campaigns</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
