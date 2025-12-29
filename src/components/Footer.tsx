import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Heart className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold">
                Edu<span className="text-primary">Donor</span>
              </span>
            </Link>
            <p className="text-background/70 text-sm">
              Empowering education through the power of giving. Every donation makes a difference in a student's life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link to="/campaigns" className="hover:text-background transition-colors">
                  Browse Campaigns
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-background transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=signup" className="hover:text-background transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@edudonor.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                123 Education Lane, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/60">
          <p>&copy; {new Date().getFullYear()} EduDonor. All rights reserved. Made with ❤️ for education.</p>
        </div>
      </div>
    </footer>
  );
}
