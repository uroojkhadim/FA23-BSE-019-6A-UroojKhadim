
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, DollarSign, User, Calendar } from 'lucide-react';
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

const Payroll = () => {
  const { data: payrolls, loading } = useFirestore('payroll');
  const { data: employees } = useFirestore('employees');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPayroll, setCurrentPayroll] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    basicSalary: '',
    bonus: '',
    deductions: '',
    month: new Date().toISOString().split('T')[0].slice(0, 7),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payrollData = {
        ...formData,
        basicSalary: parseFloat(formData.basicSalary) || 0,
        bonus: parseFloat(formData.bonus) || 0,
        deductions: parseFloat(formData.deductions) || 0,
        updatedAt: serverTimestamp(),
      };

      if (currentPayroll) {
        await updateDoc(doc(db, 'payroll', currentPayroll.id), payrollData);
        toast.success('Payroll updated');
      } else {
        await addDoc(collection(db, 'payroll'), {
          ...payrollData,
          createdAt: serverTimestamp(),
        });
        toast.success('Payroll created');
      }
      setModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('❌ Error saving payroll:', err);
      toast.error('Failed to save payroll');
    }
  };

  const handleEdit = (payroll) => {
    setCurrentPayroll(payroll);
    setFormData({
      employeeId: payroll.employeeId,
      basicSalary: payroll.basicSalary.toString(),
      bonus: payroll.bonus.toString(),
      deductions: payroll.deductions.toString(),
      month: payroll.month,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this payroll?')) {
      try {
        await deleteDoc(doc(db, 'payroll', id));
        toast.success('Payroll deleted');
      } catch (err) {
        console.error('❌ Error deleting payroll:', err);
        toast.error('Failed to delete payroll');
      }
    }
  };

  const resetForm = () => {
    setCurrentPayroll(null);
    setFormData({
      employeeId: '',
      basicSalary: '',
      bonus: '',
      deductions: '',
      month: new Date().toISOString().split('T')[0].slice(0, 7),
    });
  };

  const getEmployeeName = (id) => {
    const employee = employees?.find((e) => e.id === id);
    return employee?.name || 'Unknown Employee';
  };

  const calculateNetSalary = (payroll) => {
    return payroll.basicSalary + payroll.bonus - payroll.deductions;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredPayrolls = payrolls.filter((payroll) => {
    const employeeName = getEmployeeName(payroll.employeeId);
    return employeeName.toLowerCase().includes(search.toLowerCase());
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payroll</h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search payroll..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72"
            icon={<Search className="h-4 w-4" />}
          />
          <Button onClick={() => { resetForm(); setModalOpen(true); }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Payroll
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Employee</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Month</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Basic Salary</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Bonus</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Deductions</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Net Salary</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredPayrolls.map((payroll) => (
                <motion.tr
                  key={payroll.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {getEmployeeName(payroll.employeeId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {payroll.month}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(payroll.basicSalary)}
                  </td>
                  <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400">
                    +{formatCurrency(payroll.bonus)}
                  </td>
                  <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400">
                    -{formatCurrency(payroll.deductions)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                    {formatCurrency(calculateNetSalary(payroll))}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(payroll)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(payroll.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredPayrolls.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <DollarSign className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-lg text-gray-500 dark:text-gray-400">No payroll records found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create your first payroll record</p>
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
            {currentPayroll ? 'Edit Payroll' : 'New Payroll'}
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Month</label>
              <Input
                required
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Basic Salary</label>
                <Input
                  required
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bonus</label>
                <Input
                  type="number"
                  value={formData.bonus}
                  onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deductions</label>
                <Input
                  type="number"
                  value={formData.deductions}
                  onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">{currentPayroll ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Payroll;

