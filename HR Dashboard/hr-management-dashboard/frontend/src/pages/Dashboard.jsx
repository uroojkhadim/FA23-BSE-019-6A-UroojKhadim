import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  UserCheck,
  Clock,
  Download,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useFirestore } from '../hooks/useFirestore';
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../components/Skeleton';
import Badge from '../components/ui/Badge';
import { formatDate, getStatusColor } from '../lib/utils';

const COLORS = ['#2563EB', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#22C55E'];

const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <span>{count}</span>;
};

const Dashboard = () => {
  const { data: jobs, loading: jobsLoading } = useFirestore('jobs');
  const { data: candidates, loading: candidatesLoading } = useFirestore('candidates', {
    orderBy: { field: 'appliedDate', direction: 'desc' }
  });
  const { data: employees, loading: employeesLoading } = useFirestore('employees');
  const { data: attendance, loading: attendanceLoading } = useFirestore('attendance');

  const today = new Date().toISOString().split('T')[0];

  // Calculate stats from real-time data
  const stats = useMemo(() => {
    const totalApplications = candidates?.length || 0;
    const totalHired = candidates?.filter(c => c.status === 'hired').length || 0;
    const openJobs = jobs?.filter(j => j.status === 'open').length || 0;
    const totalEmployees = employees?.length || 0;
    const presentToday = attendance?.filter(a => a.date === today && a.status === 'present').length || 0;
    const absentToday = attendance?.filter(a => a.date === today && a.status === 'absent').length || 0;

    return { totalApplications, totalHired, openJobs, avgTimeToHire: 42, totalEmployees, presentToday, absentToday };
  }, [candidates, jobs, employees, attendance, today]);

  // Generate chart data
  const applicantsPerJobData = useMemo(() => {
    const jobCounts = {};
    jobs?.forEach(job => {
      const count = candidates?.filter(c => c.jobId === job.id).length || 0;
      if (count > 0) {
        jobCounts[job.title] = count;
      }
    });
    const result = Object.entries(jobCounts)
      .map(([name, applicants]) => ({ name: name.length > 12 ? name.slice(0, 12) + '...' : name, applicants }))
      .sort((a, b) => b.applicants - a.applicants)
      .slice(0, 5);
    return result.length > 0 ? result : [
      { name: 'Frontend Dev', applicants: 45 },
      { name: 'Backend Dev', applicants: 38 },
      { name: 'Designer', applicants: 52 },
    ];
  }, [candidates, jobs]);

  const hiringFunnelData = useMemo(() => {
    const statusOrder = ['applied', 'screened', 'interview', 'offer', 'hired'];
    return statusOrder.map(status => ({
      stage: status.charAt(0).toUpperCase() + status.slice(1),
      count: candidates?.filter(c => c.status === status).length || 0,
    }));
  }, [candidates]);

  const applicationTrendsData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      applications: Math.floor(Math.random() * 60 + 30),
    }));
  }, []);

  const departmentDistributionData = useMemo(() => {
    const deptCounts = {};
    jobs?.forEach(job => {
      const count = candidates?.filter(c => c.jobId === job.id).length || 0;
      if (deptCounts[job.department]) {
        deptCounts[job.department] += count;
      } else {
        deptCounts[job.department] = count;
      }
    });
    const result = Object.entries(deptCounts)
      .map(([name, value]) => ({ name, value }))
      .filter(d => d.value > 0);
    return result.length > 0 ? result : [
      { name: 'Engineering', value: 45 },
      { name: 'Design', value: 25 },
      { name: 'Marketing', value: 15 },
    ];
  }, [candidates, jobs]);

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications || 0,
      icon: Users,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-500',
      change: '+12.5%',
      positive: true,
    },
    {
      title: 'Total Hired',
      value: stats.totalHired || 0,
      icon: UserCheck,
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      change: '+8.3%',
      positive: true,
    },
    {
      title: 'Open Jobs',
      value: stats.openJobs || 0,
      icon: Briefcase,
      color: 'bg-gradient-to-br from-orange-500 to-amber-500',
      change: '+5.2%',
      positive: true,
    },
    {
      title: 'Total Employees',
      value: stats.totalEmployees || 0,
      icon: UserCheck,
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      change: '+3.1%',
      positive: true,
    },
  ];

  if (jobsLoading || candidatesLoading || employeesLoading || attendanceLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl mb-2" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <ChartSkeleton key={i} />)}
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back! Here's what's happening with your hiring today.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Stats Cards - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-lg">
                <CardContent className="p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
                        {typeof stat.value === 'number' ? <AnimatedCounter value={stat.value} /> : stat.value}
                      </h3>
                      <div className="flex items-center gap-2 mt-3">
                        {stat.positive ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm font-semibold ${
                            stat.positive ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500">vs last month</span>
                      </div>
                    </div>
                    <div className={`${stat.color} p-4 rounded-2xl shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Cards - Second Row (Attendance) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-lg">
            <CardContent className="p-7">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Present Today</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
                    <AnimatedCounter value={stats.presentToday || 0} />
                  </h3>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-lg">
            <CardContent className="p-7">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Absent Today</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
                    <AnimatedCounter value={stats.absentToday || 0} />
                  </h3>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl shadow-lg">
                  <XCircle className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applicants Per Job */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Applicants Per Job</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicantsPerJobData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="name" stroke="#6B7280" axisLine={false} tickLine={false} />
                  <YAxis stroke="#6B7280" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="applicants" fill="#2563EB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hiring Funnel */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Hiring Funnel</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringFunnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                  <XAxis type="number" stroke="#6B7280" axisLine={false} tickLine={false} />
                  <YAxis dataKey="stage" type="category" stroke="#6B7280" axisLine={false} tickLine={false} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="count" fill="#14B8A6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Application Trends */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Application Trends</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={applicationTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="month" stroke="#6B7280" axisLine={false} tickLine={false} />
                  <YAxis stroke="#6B7280" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ fill: '#2563EB', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Department Hiring</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Pie data={departmentDistributionData} cx="50%" cy="50%" outerRadius={70} fill="#F8FAFC" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Candidates Table */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Recent Candidates</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Name
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Job Title
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Applied Date
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {candidates?.slice(0, 5).map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white">
                      {candidate.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                      {candidate.email}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                      {candidate.jobTitle}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(candidate.appliedDate)}
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={getStatusColor(candidate.status)}>
                        {candidate.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {(!candidates || candidates.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-gray-500 dark:text-gray-400">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p className="text-lg">No candidates yet</p>
                      <p className="text-sm mt-1">Add your first candidate to get started</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
