import { Heart, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto py-6 px-8 border-t border-white/30">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-600">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="font-medium">Developed By</span>
          <span className="font-bold text-teal-700">Urooj Khadim</span>
          <Heart className="text-red-500" size={16} fill="currentColor" />
          <Code2 size={16} />
        </div>
        <p className="text-sm text-slate-500">
          © 2026 Doctor Hub | All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
