import { Routes, Route } from 'react-router-dom';
import SuperAdminLayout from '../components/SuperAdminLayout';
import SuperPanel from '../components/superadmin/Panel';
import SuperSettings from '../components/superadmin/Settings';

export default function SuperAdminDashboard() {
  return (
    <SuperAdminLayout>
      <Routes>
        <Route path="/" element={<SuperPanel />} />
        <Route path="/settings" element={<SuperSettings />} />
      </Routes>
    </SuperAdminLayout>
  );
}
