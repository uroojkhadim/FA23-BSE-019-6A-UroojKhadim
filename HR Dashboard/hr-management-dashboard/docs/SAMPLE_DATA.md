# Sample Firestore Data

Use this sample data to populate your Firestore database for testing.

## Jobs Collection

```javascript
// Collection: jobs
[
  {
    title: "Senior Frontend Developer",
    department: "Engineering",
    description: "We're looking for an experienced frontend developer to join our team.",
    requirements: [
      "5+ years of React experience",
      "Strong TypeScript skills",
      "Experience with modern build tools",
      "Team leadership experience"
    ],
    status: "open",
    postedDate: new Date("2024-05-15")
  },
  {
    title: "UX/UI Designer",
    department: "Design",
    description: "Join our design team to create beautiful user experiences.",
    requirements: [
      "3+ years of UI/UX design",
      "Proficiency in Figma",
      "Portfolio of modern web designs",
      "Understanding of design systems"
    ],
    status: "open",
    postedDate: new Date("2024-05-20")
  },
  {
    title: "Backend Engineer",
    department: "Engineering",
    description: "Build scalable backend systems for our platform.",
    requirements: [
      "4+ years Node.js experience",
      "Database design expertise",
      "API development skills",
      "Cloud platform experience"
    ],
    status: "open",
    postedDate: new Date("2024-05-25")
  },
  {
    title: "Product Manager",
    department: "Product",
    description: "Lead product strategy and roadmap development.",
    requirements: [
      "5+ years product management",
      "Technical background preferred",
      "Strong communication skills",
      "Data-driven decision making"
    ],
    status: "closed",
    postedDate: new Date("2024-04-10")
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    description: "Manage infrastructure and deployment pipelines.",
    requirements: [
      "3+ years DevOps experience",
      "Kubernetes expertise",
      "CI/CD pipeline experience",
      "Cloud platform certification"
    ],
    status: "open",
    postedDate: new Date("2024-06-01")
  }
]
```

## Candidates Collection

```javascript
// Collection: candidates
[
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    jobId: "job_id_1", // Use actual job ID
    jobTitle: "Senior Frontend Developer",
    status: "interview",
    resumeURL: "https://example.com/resumes/sarah-johnson.pdf",
    appliedDate: new Date("2024-05-20"),
    hiredDate: null
  },
  {
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    jobId: "job_id_1",
    jobTitle: "Senior Frontend Developer",
    status: "screened",
    resumeURL: "https://example.com/resumes/michael-chen.pdf",
    appliedDate: new Date("2024-05-22"),
    hiredDate: null
  },
  {
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "+1 (555) 345-6789",
    jobId: "job_id_2", // UX/UI Designer
    jobTitle: "UX/UI Designer",
    status: "offer",
    resumeURL: "https://example.com/resumes/emily-rodriguez.pdf",
    appliedDate: new Date("2024-05-23"),
    hiredDate: null
  },
  {
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 456-7890",
    jobId: "job_id_3", // Backend Engineer
    jobTitle: "Backend Engineer",
    status: "hired",
    resumeURL: "https://example.com/resumes/david-kim.pdf",
    appliedDate: new Date("2024-05-10"),
    hiredDate: new Date("2024-06-15")
  },
  {
    name: "Jessica Taylor",
    email: "jessica.t@email.com",
    phone: "+1 (555) 567-8901",
    jobId: "job_id_1",
    jobTitle: "Senior Frontend Developer",
    status: "applied",
    resumeURL: "https://example.com/resumes/jessica-taylor.pdf",
    appliedDate: new Date("2024-06-18"),
    hiredDate: null
  },
  {
    name: "Robert Martinez",
    email: "robert.m@email.com",
    phone: "+1 (555) 678-9012",
    jobId: "job_id_5", // DevOps Engineer
    jobTitle: "DevOps Engineer",
    status: "interview",
    resumeURL: "https://example.com/resumes/robert-martinez.pdf",
    appliedDate: new Date("2024-06-05"),
    hiredDate: null
  },
  {
    name: "Amanda White",
    email: "amanda.white@email.com",
    phone: "+1 (555) 789-0123",
    jobId: "job_id_2",
    jobTitle: "UX/UI Designer",
    status: "rejected",
    resumeURL: "https://example.com/resumes/amanda-white.pdf",
    appliedDate: new Date("2024-05-28"),
    hiredDate: null
  }
]
```

## HR Users Collection

```javascript
// Collection: hrUsers
[
  {
    uid: "user_auth_uid_1", // Use actual Firebase Auth UID
    email: "admin@hrportal.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01")
  },
  {
    uid: "user_auth_uid_2",
    email: "recruiter@hrportal.com",
    name: "John Recruiter",
    role: "recruiter",
    createdAt: new Date("2024-01-15")
  }
]
```

## How to Import Data

### Option 1: Using Firebase Console
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Click "Start collection"
4. Add documents manually using the data above

### Option 2: Using Firebase Admin SDK (Recommended)

Create a script `scripts/seed-data.js`:

```javascript
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedData() {
  // Add jobs
  const jobs = [ /* paste jobs data here */ ];
  for (const job of jobs) {
    await db.collection('jobs').add(job);
  }

  // Add candidates
  const candidates = [ /* paste candidates data here */ ];
  for (const candidate of candidates) {
    await db.collection('candidates').add(candidate);
  }

  console.log('✅ Data seeded successfully!');
}

seedData().catch(console.error);
```

Run: `node scripts/seed-data.js`

### Option 3: Using Firestore Import/Export
```bash
# Export (backup)
gcloud firestore export gs://[BUCKET_NAME]

# Import
gcloud firestore import gs://[BUCKET_NAME]/[EXPORT_FOLDER]
```
