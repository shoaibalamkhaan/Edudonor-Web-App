import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Menu, X, User, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground group-hover:shadow-glow transition-shadow">
              <Heart className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl font-bold text-foreground">
              Edu<span className="text-primary">Donor</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/donate" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Donate
            </Link>
            {user && (
              <Link 
                to="/history" 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                My Donations
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-1"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/history")}>
                    <Heart className="mr-2 h-4 w-4" />
                    My Donations
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button variant="hero" onClick={() => navigate("/auth?mode=signup")}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link 
                to="/donate" 
                className="text-foreground font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Donate
              </Link>
              {user && (
                <>
                  <Link 
                    to="/history" 
                    className="text-foreground font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Donations
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-foreground font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-foreground font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full" onClick={() => { navigate("/auth"); setIsMenuOpen(false); }}>
                      Sign In
                    </Button>
                    <Button variant="hero" className="w-full" onClick={() => { navigate("/auth?mode=signup"); setIsMenuOpen(false); }}>
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
