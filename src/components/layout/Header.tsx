import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'New Arrivals', href: '/new-arrivals' },
  { name: 'Clothing', href: '/clothing' },
  { name: 'Accessories', href: '/accessories' },
  { name: 'Sale', href: '/sale' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartItemCount = 3;

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-foreground text-primary-foreground py-2 text-center text-xs tracking-wider">
        FREE SHIPPING ON ORDERS OVER ₹1999 | USE CODE: SNITCH20
      </div>

      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="font-display text-2xl font-bold tracking-tight">
              SNITCH
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} className="nav-link">
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                className="hidden sm:block p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </button>
              <button
                className="hidden sm:block p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </button>
              <button
                className="relative p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 bg-background border-b border-border p-4"
            >
              <div className="container-wide">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-4 py-3 bg-secondary rounded-none border-0 focus:outline-none focus:ring-2 focus:ring-foreground"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-foreground/20"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              className="absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-background shadow-xl"
            >
              <div className="p-6 pt-20">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-lg font-medium py-2 border-b border-border"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="flex flex-col gap-4">
                    <Link to="/account" className="flex items-center gap-3 text-muted-foreground">
                      <User className="h-5 w-5" />
                      My Account
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-3 text-muted-foreground">
                      <Heart className="h-5 w-5" />
                      Wishlist
                    </Link>
                  </div>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
