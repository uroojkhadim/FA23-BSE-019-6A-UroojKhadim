import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { TrendingUp, Users, Clock, Target } from 'lucide-react';

const COLORS = ['#2563EB', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#22C55E'];

const Analytics = () => {
  // Sample data
  const monthlyHiringData = [
    { month: 'Jan', hired: 12, applications: 85 },
    { month: 'Feb', hired: 15, applications: 92 },
    { month: 'Mar', hired: 18, applications: 105 },
    { month: 'Apr', hired: 14, applications: 88 },
    { month: 'May', hired: 20, applications: 110 },
    { month: 'Jun', hired: 22, applications: 125 },
  ];

  const sourceData = [
    { name: 'LinkedIn', value: 45 },
    { name: 'Indeed', value: 30 },
    { name: 'Company Website', value: 15 },
    { name: 'Referral', value: 10 },
  ];

  const departmentPerformanceData = [
    { department: 'Engineering', timeToHire: 35, acceptanceRate: 85, satisfaction: 90 },
    { department: 'Design', timeToHire: 28, acceptanceRate: 90, satisfaction: 88 },
    { department: 'Marketing', timeToHire: 32, acceptanceRate: 78, satisfaction: 85 },
    { department: 'Sales', timeToHire: 25, acceptanceRate: 92, satisfaction: 87 },
    { department: 'HR', timeToHire: 30, acceptanceRate: 88, satisfaction: 92 },
  ];

  const diversityData = [
    { category: 'Gender Diversity', score: 75 },
    { category: 'Age Diversity', score: 68 },
    { category: 'Cultural Diversity', score: 82 },
    { category: 'Experience Level', score: 78 },
    { category: 'Educational Background', score: 85 },
  ];

  const conversionRateData = [
    { stage: 'Applied', rate: 100 },
    { stage: 'Screened', rate: 72 },
    { stage: 'Interview', rate: 38 },
    { stage: 'Offer', rate: 18 },
    { stage: 'Hired', rate: 15 },
  ];

  const kpiCards = [
    { title: 'Avg. Time to Hire', value: '32 days', icon: Clock, change: '-5%', positive: true },
    { title: 'Offer Acceptance', value: '85%', icon: Target, change: '+3%', positive: true },
    { title: 'Quality of Hire', value: '4.2/5', icon: TrendingUp, change: '+0.3', positive: true },
    { title: 'Cost per Hire', value: '$4,250', icon: Users, change: '-8%', positive: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Detailed insights and performance metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{kpi.title}</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {kpi.value}
                      </h3>
                      <p className={`text-sm mt-1 ${kpi.positive ? 'text-success' : 'text-danger'}`}>
                        {kpi.change} vs last period
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Hiring Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Hiring Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyHiringData}>
                <defs>
                  <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#14B8A6"
                  fillOpacity={1}
                  fill="url(#colorApplications)"
                />
                <Area
                  type="monotone"
                  dataKey="hired"
                  stroke="#2563EB"
                  fillOpacity={1}
                  fill="url(#colorHired)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Application Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Hiring Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="stage" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="rate" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Diversity Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Diversity & Inclusion Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={diversityData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#2563EB"
                  fill="#2563EB"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Department Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="department" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="timeToHire" fill="#2563EB" name="Time to Hire (days)" />
                <Bar dataKey="acceptanceRate" fill="#14B8A6" name="Acceptance Rate (%)" />
                <Bar dataKey="satisfaction" fill="#F59E0B" name="Satisfaction (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
