
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, CalendarDays, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { CardSkeleton } from '../components/Skeleton';
import { useFirestore } from '../hooks/useFirestore';
import { db } from '../config/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { formatDate } from '../lib/utils';

const LeaveRequests = () => {
  const { data: leaveRequests, loading } = useFirestore('leaveRequests');
  const { data: employees } = useFirestore('employees');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: 'annual',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
    status: 'pending',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        ...formData,
        updatedAt: serverTimestamp(),
      };

      if (currentRequest) {
        await updateDoc(doc(db, 'leaveRequests', currentRequest.id), requestData);
        toast.success('Leave request updated');
      } else {
        await addDoc(collection(db, 'leaveRequests'), {
          ...requestData,
          createdAt: serverTimestamp(),
        });
        toast.success('Leave request created');
      }
      setModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('❌ Error saving leave request:', err);
      toast.error('Failed to save leave request');
    }
  };

  const handleEdit = (request) => {
    setCurrentRequest(request);
    setFormData({
      employeeId: request.employeeId,
      leaveType: request.leaveType,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason,
      status: request.status,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this leave request?')) {
      try {
        await deleteDoc(doc(db, 'leaveRequests', id));
        toast.success('Leave request deleted');
      } catch (err) {
        console.error('❌ Error deleting leave request:', err);
        toast.error('Failed to delete leave request');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, 'leaveRequests', id), {
        status: 'approved',
        updatedAt: serverTimestamp(),
      });
      toast.success('Leave request approved');
    } catch (err) {
      console.error('❌ Error approving leave request:', err);
      toast.error('Failed to approve leave request');
    }
  };

  const handleReject = async (id) => {
    try {
      await updateDoc(doc(db, 'leaveRequests', id), {
        status: 'rejected',
        updatedAt: serverTimestamp(),
      });
      toast.success('Leave request rejected');
    } catch (err) {
      console.error('❌ Error rejecting leave request:', err);
      toast.error('Failed to reject leave request');
    }
  };

  const resetForm = () => {
    setCurrentRequest(null);
    setFormData({
      employeeId: '',
      leaveType: 'annual',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: '',
      status: 'pending',
    });
  };

  const getEmployeeName = (id) => {
    const employee = employees?.find((e) => e.id === id);
    return employee?.name || 'Unknown Employee';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200';
    }
  };

  const filteredRequests = leaveRequests.filter((request) => {
    const employeeName = getEmployeeName(request.employeeId);
    return employeeName.toLowerCase().includes(search.toLowerCase()) ||
           request.reason.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leave Requests</h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search leave requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72"
            icon={<Search className="h-4 w-4" />}
          />
          <Button onClick={() => { resetForm(); setModalOpen(true); }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Request
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Employee</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Leave Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Start Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">End Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredRequests.map((request) => (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {getEmployeeName(request.employeeId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {request.leaveType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(request.startDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(request.endDate)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEdit(request)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <CalendarDays className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-lg text-gray-500 dark:text-gray-400">No leave requests found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create your first leave request</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {currentRequest ? 'Edit Leave Request' : 'New Leave Request'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employee</label>
              <select
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full h-12 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Employee</option>
                {employees?.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Leave Type</label>
              <select
                required
                value={formData.leaveType}
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                className="w-full h-12 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              >
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="paternity">Paternity Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                <Input
                  required
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                <Input
                  required
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason</label>
              <textarea
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Reason for leave..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            {currentRequest && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">{currentRequest ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default LeaveRequests;

