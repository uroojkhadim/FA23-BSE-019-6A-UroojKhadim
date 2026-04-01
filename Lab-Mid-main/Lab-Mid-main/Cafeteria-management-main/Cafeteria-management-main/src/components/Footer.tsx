import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getNavItemsForRole } from '@/lib/access';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { user } = useAuthStore();
  const quickLinks = getNavItemsForRole(user?.role).filter((item) => item.path !== '/');

  return (
    <footer className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-t border-white/10">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-12 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Mail className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-2xl text-white uppercase">COMSATS Cafeteria</h3>
            </div>
            <p className="font-paragraph text-sm text-slate-300 leading-relaxed mb-6">
              Campus ordering and operations portal for menu access, counter billing, payment tracking, and daily cafeteria service.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all hover:scale-110" aria-label="Facebook">
                <Facebook className="w-5 h-5 text-white" strokeWidth={1.5} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-pink-600 rounded-xl flex items-center justify-center transition-all hover:scale-110" aria-label="Instagram">
                <Instagram className="w-5 h-5 text-white" strokeWidth={1.5} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-blue-400 rounded-xl flex items-center justify-center transition-all hover:scale-110" aria-label="Twitter">
                <Twitter className="w-5 h-5 text-white" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-12 md:col-span-4">
            <h4 className="font-heading text-base text-white uppercase mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-paragraph text-sm text-slate-300 hover:text-blue-400 hover:translate-x-1 transition-all inline-block w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="col-span-12 md:col-span-4">
            <h4 className="font-heading text-base text-white uppercase mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Contact
            </h4>
            <div className="space-y-4">
              <a href="https://maps.google.com/?q=COMSATS+Islamabad+Campus" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <div>
                  <p className="font-paragraph text-xs uppercase tracking-wide text-blue-400 mb-1">Address</p>
                  <p className="font-paragraph text-sm text-slate-300 group-hover:text-white transition-colors">COMSATS Islamabad Campus</p>
                </div>
              </a>
              <a href="mailto:cafeteria@comsats.edu.pk" className="flex items-start gap-3 group">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <div>
                  <p className="font-paragraph text-xs uppercase tracking-wide text-blue-400 mb-1">Email</p>
                  <p className="font-paragraph text-sm text-slate-300 group-hover:text-white transition-colors">cafeteria@comsats.edu.pk</p>
                </div>
              </a>
              <a href="tel:+925112345678" className="flex items-start gap-3 group">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <div>
                  <p className="font-paragraph text-xs uppercase tracking-wide text-blue-400 mb-1">Phone</p>
                  <p className="font-paragraph text-sm text-slate-300 group-hover:text-white transition-colors">+92 (51) 1234-5678</p>
                </div>
              </a>
              <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" className="block pt-4 border-t border-white/10 group">
                <p className="font-paragraph text-xs text-slate-400">
                  WhatsApp: <span className="text-white font-semibold group-hover:text-green-400 transition-colors">+92 300 0000000</span>
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-xs text-slate-400">
              Copyright © {currentYear} COMSATS Cafeteria Portal. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="font-paragraph text-xs text-slate-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="font-paragraph text-xs text-slate-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
