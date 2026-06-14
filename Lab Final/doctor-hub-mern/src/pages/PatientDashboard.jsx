import { Routes, Route } from 'react-router-dom';
import PatientLayout from '../components/PatientLayout';
import Overview from '../components/patient/Overview';
import Appointments from '../components/patient/Appointments';
import Payments from '../components/patient/Payments';
import History from '../components/patient/History';
import Prescriptions from '../components/patient/Prescriptions';
import Profile from '../components/patient/Profile';

export default function PatientDashboard() {
  return (
    <PatientLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/history" element={<History />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </PatientLayout>
  );
}
