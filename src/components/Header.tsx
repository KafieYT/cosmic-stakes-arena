
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Coins, User, Menu } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  isLoggedIn?: boolean;
  balance?: number;
  username?: string;
}

const Header = ({ isLoggedIn = false, balance = 0, username = '' }: HeaderProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Coins className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">StakeBet</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link to="/games" className="text-sm font-medium hover:text-primary transition-colors">
              Jeux
            </Link>
            <Link to="/promotions" className="text-sm font-medium hover:text-primary transition-colors">
              Promotions
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 bg-card px-3 py-2 rounded-lg border">
                  <Coins className="h-4 w-4 text-accent" />
                  <span className="font-medium">{balance.toFixed(2)} €</span>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  <User className="h-4 w-4 mr-2" />
                  {username}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="hidden sm:inline-flex"
                >
                  Se connecter
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="glow-primary"
                >
                  S'inscrire
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Accueil
              </Link>
              <Link to="/games" className="text-sm font-medium hover:text-primary transition-colors">
                Jeux
              </Link>
              <Link to="/promotions" className="text-sm font-medium hover:text-primary transition-colors">
                Promotions
              </Link>
              {isLoggedIn ? (
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <span className="text-sm">{username}</span>
                  <div className="flex items-center space-x-2">
                    <Coins className="h-4 w-4 text-accent" />
                    <span className="font-medium">{balance.toFixed(2)} €</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-border/40">
                  <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                    Se connecter
                  </Button>
                  <Button size="sm" onClick={() => navigate('/register')}>
                    S'inscrire
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
