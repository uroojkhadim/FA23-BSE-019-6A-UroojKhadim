import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Pill,
  MessageSquare,
  User,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  CheckCircle,
  Clock,
  Star,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const healthData = [
  { month: 'Jan', weight: 72, heartRate: 78 },
  { month: 'Feb', weight: 71.5, heartRate: 76 },
  { month: 'Mar', weight: 70.8, heartRate: 75 },
  { month: 'Apr', weight: 70.2, heartRate: 74 },
  { month: 'May', weight: 69.8, heartRate: 72 },
  { month: 'Jun', weight: 69.5, heartRate: 71 }
];

const appointments = [
  {
    id: 1,
    doctor: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    date: 'Today',
    time: '4:00 PM',
    status: 'Confirmed',
    clinic: 'City Heart Center',
    type: 'In-person'
  },
  {
    id: 2,
    doctor: 'Dr. Michael Chen',
    specialization: 'Neurologist',
    date: 'Tomorrow',
    time: '10:00 AM',
    status: 'Pending',
    clinic: 'Brain & Spine Clinic',
    type: 'Virtual'
  }
];

const prescriptions = [
  {
    id: 1,
    doctor: 'Dr. Sarah Johnson',
    date: '2 days ago',
    medicines: ['Aspirin 75mg', 'Atorvastatin 10mg'],
    notes: 'Take after food'
  },
  {
    id: 2,
    doctor: 'Dr. Emily Williams',
    date: '1 week ago',
    medicines: ['Vitamin D3', 'Calcium 500mg'],
    notes: 'Morning dose'
  }
];

const PatientDashboardNew = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] rounded-xl flex items-center justify-center">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1e293b]">Doctor Hub</h1>
              <p className="text-slate-500 text-sm">Patient Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-6 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: Calendar, label: 'Appointments', active: false },
            { icon: FileText, label: 'Medical History', active: false },
            { icon: Pill, label: 'Prescriptions', active: false },
            { icon: MessageSquare, label: 'Messages', active: false },
            { icon: User, label: 'Profile', active: false }
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? 'bg-[#EEF6FF] text-[#2563EB]'
                  : 'text-slate-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={22} />
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-500 transition-all">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] rounded-xl flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-[#1e293b]">John Doe</p>
              <p className="text-sm text-slate-500">john@example.com</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1">
        {/* Top Nav */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-[#F8FAFC] rounded-xl border border-gray-200 w-96">
                <Search className="text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search doctors, appointments..."
                  className="bg-transparent border-none outline-none flex-1 text-slate-700"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm text-slate-500">
                  {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="font-semibold text-[#1e293b]">
                  {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </p>
              </div>
              <button className="relative p-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 hover:border-[#2563EB] transition-all">
                <Bell className="text-slate-600" size={22} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-10">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] rounded-3xl p-8 lg:p-12 text-white mb-10"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <p className="text-white/80 text-lg mb-2">Welcome back,</p>
                <h2 className="text-4xl font-bold mb-4">John Doe</h2>
                <p className="text-white/90 max-w-lg">
                  Your next appointment is scheduled today at 4:00 PM with Dr. Sarah Johnson.
                </p>
              </div>
              <button className="bg-white text-[#2563EB] px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all">
                View Details
              </button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Upcoming', value: '2', icon: Calendar, color: '#2563EB', trend: '+1' },
              { label: 'Prescriptions', value: '5', icon: Pill, color: '#10B981', trend: '' },
              { label: 'Messages', value: '3', icon: MessageSquare, color: '#0EA5E9', trend: '+2' },
              { label: 'Reports', value: '8', icon: FileText, color: '#8B5CF6', trend: '' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-blue-900/5 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon size={28} style={{ color: stat.color }} />
                  </div>
                  {stat.trend && (
                    <div className="flex items-center gap-1 text-[#10B981] font-semibold text-sm">
                      <ArrowUpRight size={16} />
                      {stat.trend}
                    </div>
                  )}
                </div>
                <p className="text-3xl font-bold text-[#1e293b] mb-1">{stat.value}</p>
                <p className="text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#1e293b]">Upcoming Appointments</h3>
                <button className="text-[#2563EB] font-semibold hover:gap-2 transition-all flex items-center gap-1">
                  View All <ChevronRight size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {appointments.map((appointment, i) => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-blue-900/5 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                          {appointment.doctor.split(' ')[1][0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1e293b] text-lg mb-1">{appointment.doctor}</h4>
                          <p className="text-[#2563EB] font-medium mb-2">{appointment.specialization}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Calendar size={16} />
                              {appointment.date} at {appointment.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-slate-400 rounded-full" />
                              {appointment.clinic}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                          appointment.status === 'Confirmed'
                            ? 'bg-green-50 text-[#10B981]'
                            : 'bg-yellow-50 text-yellow-600'
                        }`}>
                          {appointment.status}
                        </span>
                        <button className="bg-[#EEF6FF] text-[#2563EB] px-5 py-2.5 rounded-xl font-semibold hover:bg-[#dbeafe] transition-all">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Health Stats Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-[#1e293b] mb-6">Health Overview</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#2563EB"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorWeight)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Prescriptions & History */}
          <div className="grid lg:grid-cols-2 gap-8 mt-10">
            {/* Prescriptions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#1e293b]">Recent Prescriptions</h3>
                <button className="text-[#2563EB] font-semibold hover:gap-2 transition-all flex items-center gap-1">
                  View All <ChevronRight size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {prescriptions.map((prescription, i) => (
                  <div
                    key={prescription.id}
                    className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-[#1e293b] text-lg">{prescription.doctor}</h4>
                        <p className="text-slate-500 text-sm">{prescription.date}</p>
                      </div>
                      <CheckCircle className="text-[#10B981]" size={24} />
                    </div>
                    <div className="space-y-2 mb-4">
                      {prescription.medicines.map((med, j) => (
                        <div key={j} className="flex items-center gap-2 text-slate-600">
                          <div className="w-2 h-2 bg-[#2563EB] rounded-full" />
                          {med}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-slate-500 bg-[#F8FAFC] px-4 py-2 rounded-xl">
                      💊 {prescription.notes}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-[#1e293b] mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Book Appointment', icon: Calendar, color: '#2563EB' },
                  { label: 'Order Medicine', icon: Pill, color: '#10B981' },
                  { label: 'Chat with Doctor', icon: MessageSquare, color: '#0EA5E9' },
                  { label: 'Upload Report', icon: FileText, color: '#8B5CF6' }
                ].map((action, i) => (
                  <button
                    key={i}
                    className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-blue-900/5 transition-all text-left"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${action.color}15` }}
                    >
                      <action.icon size={28} style={{ color: action.color }} />
                    </div>
                    <p className="font-bold text-[#1e293b]">{action.label}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboardNew;
