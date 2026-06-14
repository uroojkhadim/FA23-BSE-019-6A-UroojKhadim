import { useState, useEffect } from 'react';
import { Search, Sun } from 'lucide-react';

const TopBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      alert(`Searching for "${e.target.value}" — feature coming soon!`);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-700">
          <Sun className="text-yellow-500" size={20} />
          <span className="font-medium">28°C</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-600">Clear</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span className="font-medium">{formatTime(time)}</span>
          <span className="text-slate-400">|</span>
          <span>{formatDate(time)}</span>
        </div>
      </div>
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search doctors, specialties..."
          onKeyDown={handleSearch}
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
        />
      </div>
    </div>
  );
};

export default TopBar;
