import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import AdminAnalytics from '../components/admin/Analytics';
import AdminUsers from '../components/admin/Users';
import AdminDoctors from '../components/admin/Doctors';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminAnalytics />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/doctors" element={<AdminDoctors />} />
      </Routes>
    </AdminLayout>
  );
}
