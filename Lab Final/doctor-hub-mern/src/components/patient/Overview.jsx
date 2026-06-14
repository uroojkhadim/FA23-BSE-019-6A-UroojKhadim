import { Calendar, FileText, Pill } from 'lucide-react';

export default function Overview() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <Calendar className="text-primary mb-3" size={32} />
        <h3 className="text-3xl font-bold text-accent">3</h3>
        <p className="text-muted">Upcoming Appointments</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <Pill className="text-secondary mb-3" size={32} />
        <h3 className="text-3xl font-bold text-accent">8</h3>
        <p className="text-muted">Prescriptions</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <FileText className="text-primary mb-3" size={32} />
        <h3 className="text-3xl font-bold text-accent">15</h3>
        <p className="text-muted">Medical Records</p>
      </div>
    </div>
  );
}
