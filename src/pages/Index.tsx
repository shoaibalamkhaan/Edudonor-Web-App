import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Heart, Users, BookOpen, Award, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 animate-fade-up">
              Empower Education,<br />Transform Lives
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Join thousands of donors making quality education accessible to every student. 
              Your contribution creates ripples of change that last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="xl" variant="gold">
                <Link to="/donate">
                  Donate Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/auth?mode=signup">
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Heart, label: "Total Raised", value: "Rs. 500M+" },
              { icon: Users, label: "Active Donors", value: "15,000+" },
              { icon: BookOpen, label: "Students Helped", value: "8,500+" },
              { icon: Award, label: "Campaigns Funded", value: "340+" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="font-serif text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join our community of changemakers. Sign up today and start your journey of giving.
          </p>
          <Button asChild size="xl" variant="hero">
            <Link to="/auth?mode=signup">
              Get Started Free <Heart className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
