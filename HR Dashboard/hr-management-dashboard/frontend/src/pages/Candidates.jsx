
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Download, Edit2, Trash2, Eye, FileText, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { CardSkeleton } from '../components/Skeleton';
import { useFirestore } from '../hooks/useFirestore';
import { db } from '../config/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { formatDate, getStatusColor, exportToCSV } from '../lib/utils';

const Candidates = () => {
  const { data: candidates, loading: candidatesLoading } = useFirestore('candidates');
  const { data: jobs } = useFirestore('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterJob, setFilterJob] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobId: '',
    status: 'applied',
    resumeURL: '',
  });

  const handleOpenModal = (candidate = null) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setFormData({
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone || '',
        jobId: candidate.jobId,
        status: candidate.status,
        resumeURL: candidate.resumeURL || '',
      });
    } else {
      setEditingCandidate(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        jobId: '',
        status: 'applied',
        resumeURL: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedJob = jobs?.find((j) => j.id === formData.jobId);
      const candidateData = {
        ...formData,
        jobTitle: selectedJob?.title || '',
        updatedAt: serverTimestamp(),
      };

      if (editingCandidate) {
        await updateDoc(doc(db, 'candidates', editingCandidate.id), candidateData);
        toast.success('Candidate updated');
      } else {
        await addDoc(collection(db, 'candidates'), {
          ...candidateData,
          appliedDate: new Date().toISOString(),
          createdAt: serverTimestamp(),
        });
        toast.success('Candidate added');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ Error saving candidate:', err);
      toast.error('Failed to save candidate');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      try {
        await deleteDoc(doc(db, 'candidates', id));
        toast.success('Candidate deleted');
      } catch (err) {
        console.error('❌ Error deleting candidate:', err);
        toast.error('Failed to delete candidate');
      }
    }
  };

  const handleExportCSV = () => {
    const exportData = filteredCandidates.map((c) => ({
      Name: c.name,
      Email: c.email,
      Phone: c.phone || 'N/A',
      'Job Title': c.jobTitle || 'N/A',
      Status: c.status,
      'Applied Date': formatDate(c.appliedDate),
    }));
    exportToCSV(exportData, 'candidates');
  };

  const filteredCandidates = candidates?.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || candidate.status === filterStatus;
    const matchesJob = !filterJob || candidate.jobId === filterJob;
    return matchesSearch && matchesStatus && matchesJob;
  }) || [];

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  if (candidatesLoading) {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Candidates Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage candidate applications
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-1" />
            Add Candidate
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-12 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="applied">Applied</option>
              <option value="screened">Screened</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filterJob}
              onChange={(e) => setFilterJob(e.target.value)}
              className="h-12 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Jobs</option>
              {jobs?.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
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
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedCandidates.map((candidate, index) => (
                <motion.tr
                  key={candidate.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
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
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setViewingCandidate(candidate);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(candidate)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(candidate.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredCandidates.length)} of{' '}
              {filteredCandidates.length} candidates
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {filteredCandidates.length === 0 && (
        <Card className="border-none shadow-lg">
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No candidates found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Add your first candidate to get started</p>
          </CardContent>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <Input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Position
            </label>
            <select
              required
              value={formData.jobId}
              onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
              className="w-full h-12 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select Job</option>
              {jobs?.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full h-12 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            >
              <option value="applied">Applied</option>
              <option value="screened">Screened</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Resume URL
            </label>
            <Input
              type="url"
              value={formData.resumeURL}
              onChange={(e) => setFormData({ ...formData, resumeURL: e.target.value })}
              placeholder="https://example.com/resume.pdf"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
            >
              {editingCandidate ? 'Update Candidate' : 'Add Candidate'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Candidate Details"
      >
        {viewingCandidate && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white font-bold">
                  {viewingCandidate.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {viewingCandidate.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {viewingCandidate.jobTitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-900 dark:text-white">
                    {viewingCandidate.email}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-900 dark:text-white">
                    {viewingCandidate.phone || 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Applied Date</p>
                <p className="text-sm text-gray-900 dark:text-white mt-1">
                  {formatDate(viewingCandidate.appliedDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <div className="mt-1">
                  <Badge className={getStatusColor(viewingCandidate.status)}>
                    {viewingCandidate.status}
                  </Badge>
                </div>
              </div>
            </div>

            {viewingCandidate.resumeURL && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Resume</p>
                <a
                  href={viewingCandidate.resumeURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-400"
                >
                  <FileText className="h-4 w-4" />
                  View Resume
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Candidates;

