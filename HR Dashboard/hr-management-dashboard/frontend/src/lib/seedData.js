import { db } from '../config/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const seedData = async () => {
  try {
    // Check if we already have data
    const [employeesSnapshot, attendanceSnapshot, jobsSnapshot, candidatesSnapshot, leaveRequestsSnapshot, payrollSnapshot] = await Promise.all([
      getDocs(collection(db, 'employees')),
      getDocs(collection(db, 'attendance')),
      getDocs(collection(db, 'jobs')),
      getDocs(collection(db, 'candidates')),
      getDocs(collection(db, 'leaveRequests')),
      getDocs(collection(db, 'payroll')),
    ]);

    const hasData = 
      !employeesSnapshot.empty || 
      !attendanceSnapshot.empty || 
      !jobsSnapshot.empty || 
      !candidatesSnapshot.empty || 
      !leaveRequestsSnapshot.empty || 
      !payrollSnapshot.empty;

    if (hasData) {
      console.log('Data already exists, skipping seed');
      return;
    }

    console.log('Seeding sample data...');

    // Seed Jobs first
    const jobs = [
      { title: 'Senior Frontend Developer', department: 'Engineering', description: 'We are looking for an experienced frontend developer to join our team.', requirements: ['5+ years React', 'TypeScript', 'Next.js'], status: 'open', postedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { title: 'UX/UI Designer', department: 'Design', description: 'Join our design team to create beautiful user experiences.', requirements: ['Figma', 'User research', 'Design systems'], status: 'open', postedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { title: 'Backend Engineer', department: 'Engineering', description: 'Build scalable backend systems for our platform.', requirements: ['Node.js', 'PostgreSQL', 'AWS'], status: 'open', postedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { title: 'Product Manager', department: 'Product', description: 'Lead product strategy and roadmap development.', requirements: ['Agile', 'User research', 'Data analysis'], status: 'closed', postedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { title: 'DevOps Engineer', department: 'Engineering', description: 'Manage infrastructure and deployment pipelines.', requirements: ['Kubernetes', 'Docker', 'CI/CD'], status: 'open', postedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { title: 'Marketing Manager', department: 'Marketing', description: 'Oversee all marketing initiatives.', requirements: ['Digital marketing', 'SEO', 'Analytics'], status: 'open', postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { title: 'HR Specialist', department: 'HR', description: 'Manage recruitment and employee relations.', requirements: ['Recruitment', 'Employee relations', 'HRIS'], status: 'open', postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { title: 'Sales Representative', department: 'Sales', description: 'Drive business growth through sales.', requirements: ['B2B sales', 'CRM', 'Negotiation'], status: 'open', postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
    ];

    const jobIds = [];
    for (const job of jobs) {
      const docRef = await addDoc(collection(db, 'jobs'), job);
      jobIds.push(docRef.id);
    }

    // Seed Employees
    const employees = [
      { name: 'John Smith', email: 'john.smith@company.com', department: 'Engineering', designation: 'Senior Engineer', salary: 95000, joiningDate: '2022-03-15', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Emily Davis', email: 'emily.davis@company.com', department: 'Design', designation: 'Lead Designer', salary: 85000, joiningDate: '2021-08-20', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Michael Brown', email: 'michael.brown@company.com', department: 'Engineering', designation: 'Backend Developer', salary: 80000, joiningDate: '2023-01-10', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'HR', designation: 'HR Manager', salary: 75000, joiningDate: '2020-11-05', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'David Lee', email: 'david.lee@company.com', department: 'Marketing', designation: 'Marketing Lead', salary: 70000, joiningDate: '2022-06-18', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Jessica Taylor', email: 'jessica.taylor@company.com', department: 'Engineering', designation: 'Frontend Developer', salary: 72000, joiningDate: '2023-04-22', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Robert Martinez', email: 'robert.martinez@company.com', department: 'Operations', designation: 'Operations Manager', salary: 78000, joiningDate: '2021-02-14', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Amanda White', email: 'amanda.white@company.com', department: 'Design', designation: 'UX Designer', salary: 68000, joiningDate: '2023-07-30', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Christopher Anderson', email: 'chris.anderson@company.com', department: 'Product', designation: 'Product Owner', salary: 90000, joiningDate: '2020-09-12', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Jennifer Thomas', email: 'jennifer.thomas@company.com', department: 'Sales', designation: 'Account Executive', salary: 65000, joiningDate: '2022-12-01', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Daniel Jackson', email: 'daniel.jackson@company.com', department: 'Engineering', designation: 'DevOps Engineer', salary: 92000, joiningDate: '2021-05-25', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Lisa White', email: 'lisa.white@company.com', department: 'HR', designation: 'Recruiter', salary: 58000, joiningDate: '2023-02-08', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'James Harris', email: 'james.harris@company.com', department: 'Marketing', designation: 'Content Strategist', salary: 62000, joiningDate: '2022-09-15', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Patricia Clark', email: 'patricia.clark@company.com', department: 'Finance', designation: 'Accountant', salary: 67000, joiningDate: '2020-07-20', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Steven Lewis', email: 'steven.lewis@company.com', department: 'Operations', designation: 'Logistics Coordinator', salary: 55000, joiningDate: '2023-05-10', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Nancy Walker', email: 'nancy.walker@company.com', department: 'Design', designation: 'Graphic Designer', salary: 60000, joiningDate: '2022-04-05', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Brian Hall', email: 'brian.hall@company.com', department: 'Product', designation: 'Business Analyst', salary: 73000, joiningDate: '2021-10-18', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Karen Allen', email: 'karen.allen@company.com', department: 'Sales', designation: 'Sales Manager', salary: 82000, joiningDate: '2020-03-22', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Edward Young', email: 'edward.young@company.com', department: 'Engineering', designation: 'QA Engineer', salary: 69000, joiningDate: '2023-01-25', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Margaret King', email: 'margaret.king@company.com', department: 'Customer Support', designation: 'Support Lead', salary: 56000, joiningDate: '2022-07-12', status: 'active', profileImage: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
    ];

    const employeeIds = [];
    for (const employee of employees) {
      const docRef = await addDoc(collection(db, 'employees'), employee);
      employeeIds.push(docRef.id);
    }

    // Seed Candidates
    const candidates = [
      { name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 (555) 123-4567', jobId: jobIds[0], jobTitle: 'Senior Frontend Developer', status: 'interview', appliedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Michael Chen', email: 'm.chen@email.com', phone: '+1 (555) 234-5678', jobId: jobIds[0], jobTitle: 'Senior Frontend Developer', status: 'screened', appliedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Emily Rodriguez', email: 'e.rodriguez@email.com', phone: '+1 (555) 345-6789', jobId: jobIds[1], jobTitle: 'UX/UI Designer', status: 'offer', appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'David Kim', email: 'd.kim@email.com', phone: '+1 (555) 456-7890', jobId: jobIds[2], jobTitle: 'Backend Engineer', status: 'hired', appliedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Jessica Taylor', email: 'jessica.t@email.com', phone: '+1 (555) 567-8901', jobId: jobIds[0], jobTitle: 'Senior Frontend Developer', status: 'applied', appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Robert Martinez', email: 'robert.m@email.com', phone: '+1 (555) 678-9012', jobId: jobIds[4], jobTitle: 'DevOps Engineer', status: 'interview', appliedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Amanda White', email: 'amanda.w@email.com', phone: '+1 (555) 789-0123', jobId: jobIds[1], jobTitle: 'UX/UI Designer', status: 'rejected', appliedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Christopher Lee', email: 'chris.l@email.com', phone: '+1 (555) 890-1234', jobId: jobIds[0], jobTitle: 'Senior Frontend Developer', status: 'screened', appliedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Michelle Garcia', email: 'michelle.g@email.com', phone: '+1 (555) 901-2345', jobId: jobIds[2], jobTitle: 'Backend Engineer', status: 'applied', appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Daniel Robinson', email: 'daniel.r@email.com', phone: '+1 (555) 012-3456', jobId: jobIds[4], jobTitle: 'DevOps Engineer', status: 'interview', appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Lisa Anderson', email: 'lisa.a@email.com', phone: '+1 (555) 123-4567', jobId: jobIds[5], jobTitle: 'Marketing Manager', status: 'screened', appliedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'James Wilson', email: 'james.w@email.com', phone: '+1 (555) 234-5678', jobId: jobIds[6], jobTitle: 'HR Specialist', status: 'applied', appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Patricia Brown', email: 'patricia.b@email.com', phone: '+1 (555) 345-6789', jobId: jobIds[7], jobTitle: 'Sales Representative', status: 'interview', appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Robert Davis', email: 'robert.d@email.com', phone: '+1 (555) 456-7890', jobId: jobIds[2], jobTitle: 'Backend Engineer', status: 'screened', appliedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Jennifer Lee', email: 'jennifer.l@email.com', phone: '+1 (555) 567-8901', jobId: jobIds[1], jobTitle: 'UX/UI Designer', status: 'applied', appliedDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'William Martinez', email: 'william.m@email.com', phone: '+1 (555) 678-9012', jobId: jobIds[4], jobTitle: 'DevOps Engineer', status: 'offer', appliedDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Elizabeth Johnson', email: 'elizabeth.j@email.com', phone: '+1 (555) 789-0123', jobId: jobIds[5], jobTitle: 'Marketing Manager', status: 'hired', appliedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'David Smith', email: 'david.s@email.com', phone: '+1 (555) 890-1234', jobId: jobIds[6], jobTitle: 'HR Specialist', status: 'rejected', appliedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Susan Williams', email: 'susan.w@email.com', phone: '+1 (555) 901-2345', jobId: jobIds[7], jobTitle: 'Sales Representative', status: 'interview', appliedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Thomas Jones', email: 'thomas.j@email.com', phone: '+1 (555) 012-3456', jobId: jobIds[0], jobTitle: 'Senior Frontend Developer', status: 'applied', appliedDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Dorothy Garcia', email: 'dorothy.g@email.com', phone: '+1 (555) 123-4567', jobId: jobIds[2], jobTitle: 'Backend Engineer', status: 'screened', appliedDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Richard Martinez', email: 'richard.m@email.com', phone: '+1 (555) 234-5678', jobId: jobIds[1], jobTitle: 'UX/UI Designer', status: 'interview', appliedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Betty Anderson', email: 'betty.a@email.com', phone: '+1 (555) 345-6789', jobId: jobIds[4], jobTitle: 'DevOps Engineer', status: 'applied', appliedDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Paul Taylor', email: 'paul.t@email.com', phone: '+1 (555) 456-7890', jobId: jobIds[5], jobTitle: 'Marketing Manager', status: 'offer', appliedDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { name: 'Nancy Thomas', email: 'nancy.t@email.com', phone: '+1 (555) 567-8901', jobId: jobIds[6], jobTitle: 'HR Specialist', status: 'screened', appliedDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(), resumeURL: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
    ];

    for (const candidate of candidates) {
      await addDoc(collection(db, 'candidates'), candidate);
    }

    // Seed Attendance
    const attendance = [];
    const today = new Date();
    for (let i = 0; i < 50; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      const employeeId = employeeIds[Math.floor(Math.random() * employeeIds.length)];
      const status = Math.random() > 0.1 ? 'present' : 'absent';
      const checkIn = status === 'present' ? `${9 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : null;
      const checkOut = status === 'present' && Math.random() > 0.3 ? `${17 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : null;
      
      attendance.push({
        employeeId,
        date: date.toISOString().split('T')[0],
        checkIn,
        checkOut,
        status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    for (const record of attendance) {
      await addDoc(collection(db, 'attendance'), record);
    }

    // Seed Leave Requests
    const leaveTypes = ['annual', 'sick', 'personal', 'maternity', 'paternity'];
    const leaveStatuses = ['pending', 'approved', 'rejected'];
    const leaveRequests = [];
    for (let i = 0; i < 15; i++) {
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);
      
      leaveRequests.push({
        employeeId: employeeIds[Math.floor(Math.random() * employeeIds.length)],
        leaveType: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        reason: ['Summer vacation', 'Family visit', 'Medical appointment', 'Personal day', 'Religious observance'][Math.floor(Math.random() * 5)],
        status: leaveStatuses[Math.floor(Math.random() * leaveStatuses.length)],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    for (const request of leaveRequests) {
      await addDoc(collection(db, 'leaveRequests'), request);
    }

    // Seed Payroll
    const payroll = [];
    for (let i = 0; i < 20; i++) {
      const employee = employees[i % employees.length];
      const month = new Date(today);
      month.setMonth(month.getMonth() - Math.floor(Math.random() * 6));
      
      payroll.push({
        employeeId: employeeIds[i % employeeIds.length],
        basicSalary: employee.salary,
        bonus: Math.floor(Math.random() * 5000),
        deductions: Math.floor(Math.random() * 2000),
        month: month.toISOString().split('T')[0].slice(0, 7),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    for (const record of payroll) {
      await addDoc(collection(db, 'payroll'), record);
    }

    console.log('✅ Sample data seeded successfully!');
    toast.success('Sample data has been seeded');
  } catch (err) {
    console.error('❌ Error seeding data:', err);
  }
};
