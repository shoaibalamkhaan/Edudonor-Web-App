import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateDonation } from "@/hooks/useDonations";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart, CreditCard, Check, Smartphone, BookOpen } from "lucide-react";
import { z } from "zod";

type PaymentMethod = "card" | "jazzcash" | "easypaisa";

const cardSchema = z.object({
  amount: z.number().min(1, "Minimum donation is Rs. 1"),
  donorName: z.string().min(2, "Name is required"),
  donorEmail: z.string().email("Valid email is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Enter a valid 16-digit card number"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Enter expiry as MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "Enter a valid CVV"),
});

const mobileWalletSchema = z.object({
  amount: z.number().min(1, "Minimum donation is Rs. 1"),
  donorName: z.string().min(2, "Name is required"),
  donorEmail: z.string().email("Valid email is required"),
  mobileNumber: z.string().regex(/^03\d{9}$/, "Enter a valid Pakistani mobile number (03XXXXXXXXX)"),
});

const presetAmounts = [500, 1000, 2500, 5000, 10000, 25000];

export default function Donate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const createDonation = useCreateDonation();

  const [step, setStep] = useState<"amount" | "payment" | "success">("amount");
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("jazzcash");
  const [donorName, setDonorName] = useState(user?.user_metadata?.full_name || "");
  const [donorEmail, setDonorEmail] = useState(user?.email || "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");

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
      if (paymentMethod === "card") {
        cardSchema.parse({
          amount,
          donorName,
          donorEmail,
          cardNumber: cardNumber.replace(/\s/g, ""),
          expiry,
          cvv,
        });
      } else {
        mobileWalletSchema.parse({
          amount,
          donorName,
          donorEmail,
          mobileNumber,
        });
      }
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

  const paymentMethods = [
    { id: "jazzcash" as PaymentMethod, name: "JazzCash", icon: "📱" },
    { id: "easypaisa" as PaymentMethod, name: "Easypaisa", icon: "📱" },
    { id: "card" as PaymentMethod, name: "Card", icon: "💳" },
  ];

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl font-bold mb-4">Support Education</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your donation helps provide quality education to underprivileged students across Pakistan.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Education Info Card */}
            <div className="md:col-span-2">
              <Card>
                <div className="h-40 bg-gradient-hero rounded-t-lg flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-primary-foreground/80" />
                </div>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <h3 className="font-serif text-lg font-semibold">Education Donation</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Every contribution helps provide books, supplies, and educational resources to students in need.
                  </p>
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground">100% of your donation goes directly to education programs.</p>
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
                          Rs. {preset.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Custom Amount (Rs.)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rs.</span>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={(e) => handleCustomAmount(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-muted-foreground">Donation Amount</span>
                        <span className="text-2xl font-bold text-primary">Rs. {amount.toLocaleString()}</span>
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
                    <CardDescription>Select your payment method (Demo - No real charges)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Payment Method Selector */}
                    <div className="space-y-3">
                      <Label>Payment Method</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id)}
                            className={`relative p-4 rounded-lg border-2 transition-all ${
                              paymentMethod === method.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="text-center">
                              <span className="text-2xl">{method.icon}</span>
                              <p className="text-sm font-medium mt-1">{method.name}</p>
                            </div>
                            {paymentMethod === method.id && (
                              <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Donor Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Muhammad Ali" />
                        {errors.donorName && <p className="text-sm text-destructive">{errors.donorName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} placeholder="ali@example.com" />
                        {errors.donorEmail && <p className="text-sm text-destructive">{errors.donorEmail}</p>}
                      </div>
                    </div>

                    {/* Mobile Wallet Fields */}
                    {(paymentMethod === "jazzcash" || paymentMethod === "easypaisa") && (
                      <div className="space-y-2">
                        <Label>{paymentMethod === "jazzcash" ? "JazzCash" : "Easypaisa"} Mobile Number</Label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
                            placeholder="03001234567"
                            className="pl-10"
                          />
                        </div>
                        {errors.mobileNumber && <p className="text-sm text-destructive">{errors.mobileNumber}</p>}
                        <p className="text-xs text-muted-foreground">
                          Enter your {paymentMethod === "jazzcash" ? "JazzCash" : "Easypaisa"} registered mobile number
                        </p>
                      </div>
                    )}

                    {/* Card Fields */}
                    {paymentMethod === "card" && (
                      <>
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
                      </>
                    )}

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
                          <>Donate Rs. {amount.toLocaleString()}</>
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
                      <p className="text-muted-foreground">Your donation of <strong>Rs. {amount.toLocaleString()}</strong> has been processed successfully.</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Receipt Number</p>
                      <p className="font-mono font-semibold">{receiptNumber}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button onClick={() => navigate("/history")}>View My Donations</Button>
                      <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
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