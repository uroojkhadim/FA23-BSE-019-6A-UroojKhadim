# ⚡ Quick Start Guide - Role-Based System with Email Notifications

## 🎯 5-Minute Setup

### Step 1: Install Email Package (1 min)

```bash
cd backend
npm install nodemailer
```

---

### Step 2: Configure Email (2 min)

Edit `backend/.env`:

```env
# Add these lines at the bottom
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:5173
```

**Get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Create an app password for "Mail"
3. Copy the 16-character password
4. Paste in `.env` as `EMAIL_PASS`

---

### Step 3: Restart Backend (30 sec)

```bash
# In backend folder
npm run dev
```

Backend runs on: `http://localhost:5000`

---

### Step 4: Test Registration (1 min)

Open browser and go to: `http://localhost:5173/register`

Fill in:
- **Full Name:** Test Student
- **Email:** test.student@example.com
- **Password:** test123456
- **Confirm Password:** test123456
- **Role:** Student
- **Registration Number:** FA23-BSE-TEST

Click **Register** ✅

---

### Step 5: Test Login (1 min)

Go to: `http://localhost:5173/login`

Enter:
- **Email:** test.student@example.com
- **Password:** test123456
- **Role:** Student

Click **Login** ✅

Should redirect to: `/student/dashboard`

---

## 📧 Test Email Notification

### Option A: Via Admin Panel

1. Login as admin
2. Go to Orders management
3. Find an order
4. Change status to "Pending Payment"
5. Click Update
6. ✅ Email sent to student!

### Option B: Via API

```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "pending_payment"}'
```

Check your email inbox! 📬

---

## ✅ What's Working Now

| Feature | Status |
|---------|--------|
| Register with role selection | ✅ Working |
| Save to correct collection | ✅ Working |
| Login with role verification | ✅ Working |
| Role-based redirect | ✅ Working |
| Email on pending payment | ✅ Working |
| Email on status update | ✅ Working |
| Protected routes | ✅ Ready |

---

## 🎯 Role-Based Redirects

After login, users go to:

| Role | Dashboard URL | Access Level |
|------|--------------|--------------|
| Student | `/student/dashboard` | Place orders, view own orders |
| Teacher | `/teacher/dashboard` | View all orders (read-only) |
| Admin | `/admin/dashboard` | Full control, manage everything |

---

## 🔐 Security Rules

### Students Can:
- ✅ Place orders
- ✅ View their own orders
- ✅ Update their profile
- ❌ Cannot access admin panel
- ❌ Cannot see other students' data

### Teachers Can:
- ✅ View all orders
- ✅ Track order status
- ✅ View analytics
- ❌ Cannot modify orders
- ❌ Cannot delete anything
- ❌ Cannot access admin panel

### Admins Can:
- ✅ Everything (full access)
- ✅ Manage users
- ✅ Manage menu items
- ✅ Update order status (triggers email)
- ✅ Delete/cancel orders
- ✅ View all reports

---

## 🧪 Quick Test Commands

### Register Student:
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@student.com",
    "password": "test123",
    "role": "student",
    "registrationNumber": "FA23-001"
  }'
```

### Login Student:
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@student.com",
    "password": "test123",
    "role": "student"
  }'
```

### Update Order (Triggers Email):
```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "pending_payment"}'
```

---

## 📖 Full Documentation

See complete guide: [`ROLE_BASED_SYSTEM_SETUP.md`](./ROLE_BASED_SYSTEM_SETUP.md)

---

## 🆘 Troubleshooting

### Email Not Sending?
- Check `.env` has correct credentials
- Use Gmail App Password, not regular password
- Check backend console for errors

### Wrong Collection Saving?
- Ensure `role` field is in request body
- Role must be exactly: 'student', 'teacher', or 'admin'

### Login Fails?
- Email must match registration
- Password must be 6+ characters
- Role must match how user was registered

---

**That's it! Your role-based system with email notifications is ready!** 🎉✨

Test all features and check emails are being sent correctly!
