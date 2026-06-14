import { Routes, Route } from 'react-router-dom';
import DoctorLayout from '../components/DoctorLayout';
import DocOverview from '../components/doctor/Overview';
import DocClinics from '../components/doctor/Clinics';
import DocSchedule from '../components/doctor/Schedule';
import DocAppointments from '../components/doctor/Appointments';
import DocRecords from '../components/doctor/Records';
import DocProfile from '../components/doctor/Profile';

export default function DoctorDashboard() {
  return (
    <DoctorLayout>
      <Routes>
        <Route path="/" element={<DocOverview />} />
        <Route path="/clinics" element={<DocClinics />} />
        <Route path="/schedule" element={<DocSchedule />} />
        <Route path="/appointments" element={<DocAppointments />} />
        <Route path="/records" element={<DocRecords />} />
        <Route path="/profile" element={<DocProfile />} />
      </Routes>
    </DoctorLayout>
  );
}
