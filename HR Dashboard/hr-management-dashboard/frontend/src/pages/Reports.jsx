import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';

const Reports = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [reportType, setReportType] = useState('all');

  const reports = [
    {
      id: 1,
      title: 'Monthly Hiring Report',
      description: 'Comprehensive hiring statistics for the month',
      date: '2024-06-01',
      type: 'hiring',
      size: '2.3 MB',
    },
    {
      id: 2,
      title: 'Department Performance Analysis',
      description: 'Performance metrics across all departments',
      date: '2024-06-01',
      type: 'performance',
      size: '1.8 MB',
    },
    {
      id: 3,
      title: 'Candidate Pipeline Report',
      description: 'Current status of all active candidates',
      date: '2024-05-28',
      type: 'pipeline',
      size: '3.1 MB',
    },
    {
      id: 4,
      title: 'Time to Hire Analytics',
      description: 'Analysis of hiring timeline efficiency',
      date: '2024-05-25',
      type: 'analytics',
      size: '1.5 MB',
    },
    {
      id: 5,
      title: 'Diversity & Inclusion Report',
      description: 'Workforce diversity statistics',
      date: '2024-05-20',
      type: 'diversity',
      size: '2.0 MB',
    },
    {
      id: 6,
      title: 'Cost Per Hire Analysis',
      description: 'Detailed breakdown of recruitment costs',
      date: '2024-05-15',
      type: 'financial',
      size: '1.2 MB',
    },
  ];

  const reportTemplates = [
    { name: 'Hiring Summary', description: 'Overview of hiring activities' },
    { name: 'Candidate Analytics', description: 'Detailed candidate metrics' },
    { name: 'Department Performance', description: 'Department-wise analysis' },
    { name: 'Custom Report', description: 'Build your own report' },
  ];

  const handleGenerateReport = (template) => {
    alert(`Generating ${template.name}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Generate and download recruitment reports
        </p>
      </div>

      {/* Quick Generate */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTemplates.map((template, index) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary transition-colors cursor-pointer"
                onClick={() => handleGenerateReport(template)}
              >
                <FileText className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {template.description}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last3months">Last 3 Months</option>
              <option value="last6months">Last 6 Months</option>
              <option value="lastyear">Last Year</option>
            </Select>
            <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="hiring">Hiring</option>
              <option value="performance">Performance</option>
              <option value="analytics">Analytics</option>
              <option value="financial">Financial</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.date}
                      </span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
