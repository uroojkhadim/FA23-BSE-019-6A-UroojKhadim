import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, User, Upload, Download, FileSpreadsheet } from 'lucide-react';
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
import { formatDate, exportToCSV, exportToExcel } from '../lib/utils';
import * as XLSX from 'xlsx';

const Employees = () => {
  const { data: employees, loading } = useFirestore('employees');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    salary: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'active',
    profileImage: '',
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        // Validate required fields
        const validData = jsonData.map(row => ({
          name: row.name || row.Name || row['Full Name'],
          email: row.email || row.Email,
          department: row.department || row.Department,
          designation: row.designation || row.Designation,
          salary: row.salary || row.Salary || 0,
          joiningDate: row.joiningDate || row['Joining Date'] || new Date().toISOString().split('T')[0],
          status: 'active',
        })).filter(row => row.name && row.email);
        
        setImportPreview(validData);
      } catch (err) {
        console.error('Error parsing file:', err);
        toast.error('Failed to parse file. Please check the format.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    try {
      const batch = [];
      for (const emp of importPreview) {
        batch.push(
          addDoc(collection(db, 'employees'), {
            ...emp,
            salary: parseInt(emp.salary) || 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        );
      }
      await Promise.all(batch);
      toast.success(`Successfully imported ${importPreview.length} employees!`);
      setImportModalOpen(false);
      setImportPreview([]);
    } catch (err) {
      console.error('Error importing employees:', err);
      toast.error('Failed to import employees');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const employeeData = {
        ...formData,
        salary: parseInt(formData.salary) || 0,
        updatedAt: serverTimestamp(),
      };
      
      if (currentEmployee) {
        await updateDoc(doc(db, 'employees', currentEmployee.id), employeeData);
        toast.success('Employee updated');
      } else {
        await addDoc(collection(db, 'employees'), {
          ...employeeData,
          createdAt: serverTimestamp(),
        });
        toast.success('Employee created');
      }
      setModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('❌ Error saving employee:', err);
      toast.error('Failed to save employee');
    }
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department || '',
      designation: employee.designation || '',
      salary: employee.salary?.toString() || '',
      joiningDate: employee.joiningDate || new Date().toISOString().split('T')[0],
      status: employee.status || 'active',
      profileImage: employee.profileImage || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteDoc(doc(db, 'employees', id));
        toast.success('Employee deleted');
      } catch (err) {
        console.error('❌ Error deleting employee:', err);
        toast.error('Failed to delete employee');
      }
    }
  };

  const resetForm = () => {
    setCurrentEmployee(null);
    setFormData({
      name: '',
      email: '',
      department: '',
      designation: '',
      salary: '',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'active',
      profileImage: '',
    });
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase()) || 
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employees</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72"
            icon={<Search className="h-4 w-4" />}
          />
          <div className="flex gap-2">
            <Button
              onClick={() => setImportModalOpen(true)}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" /> Import
            </Button>
            <Button
              onClick={() => exportToCSV(employees, 'employees')}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> CSV
            </Button>
            <Button
              onClick={() => exportToExcel(employees, 'employees')}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
            <Button onClick={() => { resetForm(); setModalOpen(true); }} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Employee
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Department</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Designation</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Salary</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredEmployees.map((emp) => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{emp.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{emp.department || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{emp.designation || '-'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    ${emp.salary?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={emp.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}>
                      {emp.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <User className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-lg text-gray-500 dark:text-gray-400">No employees found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add your first employee to get started</p>
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
            {currentEmployee ? 'Edit Employee' : 'Add Employee'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Engineering"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Designation</label>
                <Input
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salary</label>
                <Input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="60000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Joining Date</label>
                <Input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">{currentEmployee ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Import Employees
          </h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Upload Excel or CSV file
              </p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
              >
                Click to browse
              </label>
            </div>
            {importPreview.length > 0 && (
              <>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 max-h-60 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="py-2 px-3">Name</th>
                        <th className="py-2 px-3">Email</th>
                        <th className="py-2 px-3">Department</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.map((emp, idx) => (
                        <tr key={idx} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="py-2 px-3">{emp.name}</td>
                          <td className="py-2 px-3">{emp.email}</td>
                          <td className="py-2 px-3">{emp.department || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={() => setImportModalOpen(false)}>Cancel</Button>
                  <Button type="button" onClick={handleImport}>
                    Import {importPreview.length} Employees
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Employees;
