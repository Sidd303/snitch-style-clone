import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Shirts', href: '/clothing/shirts' },
    { name: 'T-Shirts', href: '/clothing/t-shirts' },
    { name: 'Trousers', href: '/clothing/trousers' },
    { name: 'Jackets', href: '/clothing/jackets' },
    { name: 'Accessories', href: '/accessories' },
  ],
  help: [
    { name: 'Track Order', href: '/track-order' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Contact Us', href: '/contact' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Store Locator', href: '/stores' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container-wide py-12 md:py-16">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-display text-2xl md:text-3xl font-light mb-4">
              Join the Club
            </h3>
            <p className="text-primary-foreground/70 mb-6">
              Subscribe for exclusive offers, early access to new arrivals, and style updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 
                         text-primary-foreground placeholder:text-primary-foreground/50 
                         focus:outline-none focus:border-primary-foreground/40"
              />
              <button
                type="submit"
                className="bg-primary-foreground text-foreground px-8 py-3 font-medium 
                         tracking-wide hover:bg-primary-foreground/90 transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-2xl font-bold tracking-tight">
              SNITCH
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
              Modern menswear for the contemporary man. Quality craftsmanship meets 
              affordable style.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-primary-foreground/70 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-foreground/70 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-foreground/70 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-foreground/70 transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-medium tracking-wide mb-4">SHOP</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-medium tracking-wide mb-4">HELP</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-medium tracking-wide mb-4">COMPANY</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-wide py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© 2026 SNITCH. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>We accept:</span>
              <div className="flex gap-2">
                <div className="w-10 h-6 bg-primary-foreground/20 rounded flex items-center justify-center text-[10px]">
                  VISA
                </div>
                <div className="w-10 h-6 bg-primary-foreground/20 rounded flex items-center justify-center text-[10px]">
                  MC
                </div>
                <div className="w-10 h-6 bg-primary-foreground/20 rounded flex items-center justify-center text-[10px]">
                  UPI
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
