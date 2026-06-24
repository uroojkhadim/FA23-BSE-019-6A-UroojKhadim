import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Calendar, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { CardSkeleton } from '../components/Skeleton';
import { useFirestore } from '../hooks/useFirestore';
import { db } from '../config/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { formatDate } from '../lib/utils';

const Attendance = () => {
  const { data: attendance, loading } = useFirestore('attendance');
  const [search, setSearch] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleCheckIn = async () => {
    try {
      await addDoc(collection(db, 'attendance'), {
        employeeId: 'demo',
        date: today,
        checkIn: new Date().toLocaleTimeString(),
        status: 'present',
        createdAt: serverTimestamp(),
      });
      toast.success('Checked in');
    } catch (err) {
      console.error('❌ Error checking in:', err);
      toast.error('Failed to check in');
    }
  };

  const handleCheckOut = async (record) => {
    try {
      await updateDoc(doc(db, 'attendance', record.id), {
        checkOut: new Date().toLocaleTimeString(),
      });
      toast.success('Checked out');
    } catch (err) {
      console.error('❌ Error checking out:', err);
      toast.error('Failed to check out');
    }
  };

  const todayAttendance = attendance.find((a) => a.date === today);
  const presentToday = attendance.filter((a) => a.date === today && a.status === 'present').length;
  const absentToday = attendance.filter((a) => a.date === today && a.status === 'absent').length;

  const filteredAttendance = attendance.filter(record => 
    record.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance</h1>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search attendance..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72"
            icon={<Search className="h-4 w-4" />}
          />
          {!todayAttendance?.checkIn && (
            <Button onClick={handleCheckIn} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Check In
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Present Today</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{presentToday}</h3>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Absent Today</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{absentToday}</h3>
              </div>
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-2xl">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Check In Time</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {todayAttendance?.checkIn || '--:--'}
                </h3>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Employee ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Check In</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Check Out</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredAttendance.slice(0, 20).map((record) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(record.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{record.employeeId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{record.checkIn || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{record.checkOut || '-'}</td>
                  <td className="px-6 py-4">
                    <Badge className={
                      record.status === 'present'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : record.status === 'absent'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }>
                      {record.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {!record.checkOut && record.checkIn && (
                      <Button onClick={() => handleCheckOut(record)} variant="secondary" size="sm">
                        Check Out
                      </Button>
                    )}
                  </td>
                </motion.tr>
              ))}
              {filteredAttendance.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Clock className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-lg text-gray-500 dark:text-gray-400">No attendance records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Attendance;
