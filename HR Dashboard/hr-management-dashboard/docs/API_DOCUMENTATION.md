# API Documentation

Complete API reference for the HR Management Dashboard backend.

## Base URL

**Development:** `http://localhost:5001/api`  
**Production:** `https://us-central1-your-project.cloudfunctions.net/api`

## Authentication

All API endpoints (except `/health`) require authentication using Firebase ID tokens.

### Headers

```http
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
Content-Type: application/json
```

### Getting a Token

```javascript
// Frontend - Using Firebase Auth
const token = await user.getIdToken();
```

## API Endpoints

### Health Check

#### GET /health

Check API status (no authentication required).

**Response:**
```json
{
  "status": "ok",
  "message": "HR Management API is running"
}
```

---

### Statistics

#### GET /api/stats

Get dashboard statistics.

**Response:**
```json
{
  "totalApplications": 150,
  "totalHired": 38,
  "openJobs": 12,
  "avgTimeToHire": 32
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

### Jobs

#### GET /api/jobs

Get all jobs with candidate counts.

**Response:**
```json
[
  {
    "id": "job123",
    "title": "Senior Frontend Developer",
    "department": "Engineering",
    "description": "We're looking for an experienced developer...",
    "requirements": [
      "5+ years of React experience",
      "Strong TypeScript skills"
    ],
    "status": "open",
    "postedDate": "2024-05-15T00:00:00.000Z",
    "candidateCount": 15
  }
]
```

---

#### GET /api/jobs/:id

Get a single job by ID.

**Parameters:**
- `id` (path) - Job document ID

**Response:**
```json
{
  "id": "job123",
  "title": "Senior Frontend Developer",
  "department": "Engineering",
  "description": "We're looking for an experienced developer...",
  "requirements": ["5+ years of React experience"],
  "status": "open",
  "postedDate": "2024-05-15T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `404` - Job not found
- `401` - Unauthorized

---

#### POST /api/jobs

Create a new job.

**Request Body:**
```json
{
  "title": "Senior Frontend Developer",
  "department": "Engineering",
  "description": "We're looking for an experienced developer...",
  "requirements": [
    "5+ years of React experience",
    "Strong TypeScript skills"
  ],
  "status": "open"
}
```

**Required Fields:**
- `title` (string)
- `department` (string)

**Optional Fields:**
- `description` (string)
- `requirements` (array of strings)
- `status` (string: "open" or "closed", default: "open")

**Response:**
```json
{
  "id": "newjob123",
  "title": "Senior Frontend Developer",
  "department": "Engineering",
  "description": "We're looking for an experienced developer...",
  "requirements": ["5+ years of React experience"],
  "status": "open",
  "postedDate": "2024-06-22T00:00:00.000Z",
  "createdBy": "user_uid"
}
```

**Status Codes:**
- `201` - Created
- `400` - Bad request (validation error)
- `401` - Unauthorized

---

#### PUT /api/jobs/:id

Update an existing job.

**Parameters:**
- `id` (path) - Job document ID

**Request Body:**
```json
{
  "title": "Lead Frontend Developer",
  "department": "Engineering",
  "description": "Updated description...",
  "requirements": ["Updated requirements"],
  "status": "closed"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Response:**
```json
{
  "id": "job123",
  "title": "Lead Frontend Developer",
  "updatedAt": "2024-06-22T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request
- `401` - Unauthorized
- `404` - Not found

---

#### DELETE /api/jobs/:id

Delete a job.

**Parameters:**
- `id` (path) - Job document ID

**Response:**
```json
{
  "message": "Job deleted successfully",
  "id": "job123"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - Not found

---

### Candidates

#### GET /api/candidates

Get candidates with optional filters.

**Query Parameters:**
- `status` (optional) - Filter by status (applied, screened, interview, offer, hired, rejected)
- `jobId` (optional) - Filter by job ID
- `limit` (optional) - Limit number of results

**Example:**
```
GET /api/candidates?status=interview&jobId=job123&limit=10
```

**Response:**
```json
[
  {
    "id": "candidate123",
    "name": "Sarah Johnson",
    "email": "sarah@email.com",
    "phone": "+1 (555) 123-4567",
    "jobId": "job123",
    "jobTitle": "Senior Frontend Developer",
    "status": "interview",
    "resumeURL": "https://storage.example.com/resume.pdf",
    "appliedDate": "2024-05-20T00:00:00.000Z",
    "hiredDate": null
  }
]
```

---

#### GET /api/candidates/:id

Get a single candidate by ID.

**Parameters:**
- `id` (path) - Candidate document ID

**Response:**
```json
{
  "id": "candidate123",
  "name": "Sarah Johnson",
  "email": "sarah@email.com",
  "phone": "+1 (555) 123-4567",
  "jobId": "job123",
  "jobTitle": "Senior Frontend Developer",
  "status": "interview",
  "resumeURL": "https://storage.example.com/resume.pdf",
  "appliedDate": "2024-05-20T00:00:00.000Z",
  "hiredDate": null
}
```

**Status Codes:**
- `200` - Success
- `404` - Candidate not found
- `401` - Unauthorized

---

#### POST /api/candidates

Create a new candidate.

**Request Body:**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah@email.com",
  "phone": "+1 (555) 123-4567",
  "jobId": "job123",
  "jobTitle": "Senior Frontend Developer",
  "status": "applied",
  "resumeURL": "https://storage.example.com/resume.pdf"
}
```

**Required Fields:**
- `name` (string)
- `email` (string)
- `jobId` (string)

**Optional Fields:**
- `phone` (string)
- `jobTitle` (string)
- `status` (string, default: "applied")
- `resumeURL` (string)

**Response:**
```json
{
  "id": "newcandidate123",
  "name": "Sarah Johnson",
  "email": "sarah@email.com",
  "phone": "+1 (555) 123-4567",
  "jobId": "job123",
  "jobTitle": "Senior Frontend Developer",
  "status": "applied",
  "resumeURL": "https://storage.example.com/resume.pdf",
  "appliedDate": "2024-06-22T00:00:00.000Z",
  "hiredDate": null,
  "createdBy": "user_uid"
}
```

**Status Codes:**
- `201` - Created
- `400` - Bad request (validation error)
- `401` - Unauthorized

---

#### PUT /api/candidates/:id

Update an existing candidate.

**Parameters:**
- `id` (path) - Candidate document ID

**Request Body:**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah@email.com",
  "phone": "+1 (555) 123-4567",
  "jobId": "job123",
  "jobTitle": "Senior Frontend Developer",
  "status": "hired",
  "resumeURL": "https://storage.example.com/resume.pdf"
}
```

**Note:** All fields are optional. When status changes to "hired", `hiredDate` is automatically set.

**Response:**
```json
{
  "id": "candidate123",
  "status": "hired",
  "hiredDate": "2024-06-22T00:00:00.000Z",
  "updatedAt": "2024-06-22T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request
- `401` - Unauthorized
- `404` - Not found

---

#### DELETE /api/candidates/:id

Delete a candidate.

**Parameters:**
- `id` (path) - Candidate document ID

**Response:**
```json
{
  "message": "Candidate deleted successfully",
  "id": "candidate123"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - Not found

---

## Error Responses

### Standard Error Format

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Firebase Cloud Functions have built-in rate limiting. Typical limits:
- 1000 requests per second per function
- Automatic scaling based on load

## Testing the API

### Using cURL

```bash
# Get token from Firebase first
TOKEN="your_firebase_id_token"

# Test health endpoint
curl http://localhost:5001/health

# Get stats
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5001/api/stats

# Get jobs
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5001/api/jobs

# Create job
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Job","department":"Engineering"}' \
  http://localhost:5001/api/jobs
```

### Using Postman

1. Create new request
2. Set Authorization type to "Bearer Token"
3. Add your Firebase ID token
4. Make request to endpoints

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request
3. Add Bearer token in Auth tab
4. Test endpoints

## Development vs Production

### Development
- Base URL: `http://localhost:5001/api`
- CORS enabled for all origins
- Detailed error messages

### Production
- Base URL: `https://us-central1-your-project.cloudfunctions.net/api`
- CORS configured for specific domains
- Generic error messages

---

For more information, see the [Setup Guide](SETUP_GUIDE.md) and [Deployment Guide](DEPLOYMENT_GUIDE.md).
