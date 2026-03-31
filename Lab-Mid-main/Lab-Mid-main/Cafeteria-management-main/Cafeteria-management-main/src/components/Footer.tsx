import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getNavItemsForRole } from '@/lib/access';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { user } = useAuthStore();
  const quickLinks = getNavItemsForRole(user?.role).filter((item) => item.path !== '/');

  return (
    <footer className="w-full bg-background border-t border-secondary">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-12 gap-6 sm:gap-8">
          <div className="col-span-12 md:col-span-4">
            <h3 className="font-heading text-xl text-foreground uppercase mb-4">
              COMSATS Cafeteria
            </h3>
            <p className="font-paragraph text-sm text-foreground leading-relaxed">
              Campus ordering and operations portal for menu access, counter billing, payment tracking, and daily cafeteria service.
            </p>
          </div>

          <div className="col-span-12 md:col-span-4">
            <h4 className="font-heading text-base text-foreground uppercase mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-paragraph text-sm text-foreground hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="col-span-12 md:col-span-4">
            <h4 className="font-heading text-base text-foreground uppercase mb-4">
              Contact
            </h4>
            <div className="space-y-3">
              <p className="font-paragraph text-sm text-foreground">
                COMSATS Islamabad Campus
              </p>
              <p className="font-paragraph text-sm text-foreground">
                cafeteria@comsats.edu.pk
              </p>
              <p className="font-paragraph text-sm text-foreground">
                +92 (51) 1234-5678
              </p>
              <p className="font-paragraph text-sm text-foreground">
                WhatsApp: +92 300 0000000
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-secondary">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-xs text-foreground">
              Copyright {currentYear} COMSATS Cafeteria Portal. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="font-paragraph text-xs text-foreground hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="font-paragraph text-xs text-foreground hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
