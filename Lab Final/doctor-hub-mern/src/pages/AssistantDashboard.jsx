import { Routes, Route } from 'react-router-dom';
import AssistantLayout from '../components/AssistantLayout';
import AssistPayments from '../components/assistant/Payments';
import AssistQueue from '../components/assistant/Queue';

export default function AssistantDashboard() {
  return (
    <AssistantLayout>
      <Routes>
        <Route path="/" element={<AssistQueue />} />
        <Route path="/payments" element={<AssistPayments />} />
      </Routes>
    </AssistantLayout>
  );
}
