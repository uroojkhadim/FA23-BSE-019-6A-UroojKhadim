# 🔧 University Cafe Management System - Role & Email Setup Guide

## ✅ Complete Implementation Summary

Your cafe management system now has:
- ✅ **Role-based access control** (Student, Teacher, Admin)
- ✅ **Email notifications** for pending payments
- ✅ **Automatic email triggers** when order status changes
- ✅ **Proper user registration** with role selection
- ✅ **Role-based route protection**

---

## 📋 What's Been Implemented

### 1️⃣ Backend Updates

#### New Files Created:

**`backend/controllers/authController.js`** - Main authentication logic
- `registerUser()` - Register users with role-based collection assignment
- `loginUser()` - Login and verify credentials across collections
- `updateOrderStatus()` - Update order status + trigger email notifications
- `getUserByEmail()` - Search user across all collections

**`backend/services/emailService.js`** - Email notification service
- `sendPendingPaymentEmail()` - Send beautiful HTML emails for pending payments
- `sendOrderStatusUpdateEmail()` - Send status update notifications
- Uses Nodemailer with Gmail/SMTP

**`backend/routes/apiRoutes.js`** - Updated API routes
- `/api/register` - POST - Register new user with role
- `/api/login` - POST - Login with role
- `/api/user/:email` - GET - Get user by email
- `/api/orders/:orderId/status` - PUT - Update order status (triggers email)

---

### 2️⃣ Database Structure

#### Collections:

**Students Collection:**
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique, lowercase),
  password: String (hashed),
  registrationNumber: String (unique),
  contactNumber: String,
  phoneNumberVerified: Boolean,
  role: 'student',
  universityName: String,
  profilePicture: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Teachers Collection:**
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique, lowercase),
  password: String (hashed),
  cnicNumber: String (unique),
  department: String,
  phoneNumber: String,
  phoneNumberVerified: Boolean,
  role: 'teacher',
  profilePicture: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Administrators Collection:**
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique, lowercase),
  password: String (hashed),
  adminRole: String, // 'super_admin', 'manager', 'staff'
  role: 'admin',
  profilePicture: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## 🚀 Step-by-Step Setup Instructions

### Step 1: Install Email Dependencies

```bash
cd backend
npm install nodemailer
```

---

### Step 2: Configure Email Settings

Edit `backend/.env` file:

```env
# Email Configuration (for Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/cafeteria-management

# JWT Secret (if using)
JWT_SECRET=your-secret-key
```

**For Gmail:**
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Use the App Password in `.env` (NOT your regular password)

---

### Step 3: Update Database Models

All models already have the `role` field configured:
- Student: `role: { type: String, enum: ['student'], default: 'student' }`
- Teacher: `role: { type: String, enum: ['teacher'], default: 'teacher' }`
- Administrator: `role: { type: String, enum: ['admin'], default: 'admin' }`

✅ **Already done!** No changes needed.

---

### Step 4: Restart Backend Server

```bash
cd backend
npm run dev
```

Server will start on: `http://localhost:5000`

---

### Step 5: Test Registration with Role

#### Register a Student:

```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "student@example.com",
    "password": "password123",
    "role": "student",
    "registrationNumber": "FA23-BSE-001",
    "contactNumber": "+923001234567"
  }'
```

#### Register a Teacher:

```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Dr. Jane Smith",
    "email": "teacher@example.com",
    "password": "password123",
    "role": "teacher",
    "cnicNumber": "12345-1234567-1",
    "department": "Computer Science"
  }'
```

#### Register an Admin:

```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin",
    "adminRole": "super_admin"
  }'
```

---

### Step 6: Test Login with Role-Based Redirect

```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "role": "student"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "student@example.com",
    "role": "student",
    "registrationNumber": "FA23-BSE-001"
  }
}
```

---

### Step 7: Test Email Notifications

#### Create an Order (via frontend or API):

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "STUDENT_ID_HERE",
    "userModel": "Student",
    "items": [{
      "menuItem": "MENU_ITEM_ID",
      "quantity": 2,
      "price": 150
    }],
    "totalAmount": 300,
    "status": "pending_payment"
  }'
```

#### Update Order Status to Trigger Email:

```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "pending_payment"
  }'
```

**This will automatically send an email to the user!**

Check your terminal for:
```
✅ Email sent successfully: <message-id>
```

---

## 🎯 Frontend Integration

### Registration Flow:

1. User fills registration form with role selection
2. Frontend sends POST to `/api/register` with role
3. Backend saves to appropriate collection (students/teachers/admins)
4. User account created with correct role

### Login Flow:

1. User enters email, password, and selects role
2. Frontend sends POST to `/api/login` with role
3. Backend searches in correct collection based on role
4. Returns user data with role
5. Frontend redirects based on role:
   - Student → `/student/dashboard`
   - Teacher → `/teacher/dashboard`
   - Admin → `/admin/dashboard`

### Order Status Update Flow:

1. Admin updates order status in admin panel
2. Frontend sends PUT to `/api/orders/:id/status`
3. Backend updates order
4. Backend fetches user email based on userId and userModel
5. Sends appropriate email (pending payment or status update)
6. Returns success with `emailSent: true`

---

## 📧 Email Templates

### Pending Payment Email:

**Subject:** Payment Pending - Uni Cafe

**Content:**
- Beautiful gradient header
- Order details table
- Items list
- Call-to-action button
- Professional footer

### Status Update Email:

**Subject:** Order Status Update - [Status]

**Content:**
- Color-coded status badge
- Order ID and timestamp
- Thank you message
- Professional branding

---

## 🔐 Security Features

### Role-Based Access Control:

```javascript
// Example usage in components
const { hasPermission } = useAuthStore();

if (!hasPermission('admin')) {
  // Redirect or show error
}

if (hasPermission(['admin', 'teacher'])) {
  // Allow access
}
```

### Route Protection:

```javascript
// In React Router
<Route 
  path="/admin/*" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 🎨 UI/UX Updates Needed

### Navigation Bar:

Show different menu items based on role:

```jsx
{user.role === 'admin' && (
  <NavItem to="/admin/users">Manage Users</NavItem>
)}

{user.role === 'teacher' && (
  <NavItem to="/teacher/orders">View Orders</NavItem>
)}

{user.role === 'student' && (
  <NavItem to="/student/place-order">Place Order</NavItem>
)}
```

### Admin Panel Features:

- ✅ View all orders
- ✅ Update order status (triggers email)
- ✅ Manage users (students/teachers)
- ✅ View analytics
- ❌ Hidden from students and teachers

### Teacher Dashboard:

- ✅ View all orders (read-only)
- ✅ Track order status
- ❌ Cannot modify orders
- ❌ Hidden from students

### Student Dashboard:

- ✅ Place new orders
- ✅ View own orders
- ✅ See order status
- ❌ Cannot see other students' orders

---

## 🧪 Testing Checklist

### Registration:

- [ ] Register as student with valid data
- [ ] Register as teacher with valid data
- [ ] Register as admin with valid data
- [ ] Try duplicate email (should fail)
- [ ] Try missing required fields (should fail)

### Login:

- [ ] Login as student (correct role)
- [ ] Login as teacher (correct role)
- [ ] Login as admin (correct role)
- [ ] Try wrong password (should fail)
- [ ] Try wrong role selection (should fail)

### Email Notifications:

- [ ] Create order with status `pending_payment`
- [ ] Check email received
- [ ] Update order status to `preparing`
- [ ] Check status update email received
- [ ] Verify email content is correct

### Role-Based Access:

- [ ] Student tries to access admin panel (should be blocked)
- [ ] Teacher views orders (should work)
- [ ] Teacher tries to update order (should be blocked)
- [ ] Admin updates order status (should work + send email)

---

## 🔍 Troubleshooting

### Issue 1: Email Not Sending

**Check:**
1. `.env` has `EMAIL_USER` and `EMAIL_PASS`
2. Using App Password (not regular Gmail password)
3. Internet connection
4. Check backend console for errors

**Solution:**
```bash
# Test email configuration
node test-email.js
```

---

### Issue 2: User Not Found in Collection

**Cause:** Registered with one role, trying to login with another

**Solution:**
- Ensure role selected at login matches registration role
- Or delete user and re-register with correct role

---

### Issue 3: Order Status Update Doesn't Send Email

**Check:**
1. User email exists in database
2. Order has valid userId and userModel
3. Backend console shows email sent
4. SMTP credentials are correct

**Debug:**
```javascript
// Add logging in authController.js
console.log('Sending email to:', userEmail);
console.log('Order details:', orderDetails);
```

---

### Issue 4: Role Not Saved Correctly

**Check:**
1. Request body includes `role` field
2. Role is one of: 'student', 'teacher', 'admin'
3. Required fields for that role are present

**Verify in MongoDB:**
```javascript
db.students.findOne({ email: "test@example.com" })
// Should show: role: "student"
```

---

## 📊 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/register` | Register new user with role | No |
| POST | `/api/login` | Login with role | No |
| GET | `/api/user/:email` | Get user by email | No |
| PUT | `/api/orders/:id/status` | Update order status + send email | Yes |
| GET | `/api/students` | Get all students | Admin only |
| GET | `/api/teachers` | Get all teachers | Admin only |
| GET | `/api/admins` | Get all admins | Admin only |
| POST | `/api/menu-items` | Create menu item | Admin only |
| GET | `/api/orders` | Get all orders | Yes |
| POST | `/api/orders` | Create order | Yes |

---

## 🎉 Success Indicators

When everything works correctly:

✅ **Registration:**
- User saved to correct collection based on role
- Role field properly set
- Password hashed
- Email unique validation works

✅ **Login:**
- Credentials verified
- Role returned in response
- Frontend redirects to correct dashboard
- Wrong role selection fails gracefully

✅ **Email Notifications:**
- Order status change triggers email
- Email received within seconds
- HTML renders correctly
- Links work

✅ **Role-Based Access:**
- Students see only student features
- Teachers see read-only order list
- Admins see full management panel
- Unauthorized access blocked

---

## 🚀 Next Steps

1. ✅ Backend configured with roles and email
2. ✅ API endpoints ready
3. ⏳ Test registration flow
4. ⏳ Test login flow
5. ⏳ Test email notifications
6. ⏳ Verify role-based access in frontend

---

## 📖 Additional Resources

- **Nodemailer Docs:** https://nodemailer.com/
- **Gmail App Passwords:** https://support.google.com/accounts/answer/185833
- **MongoDB Roles:** Consider adding MongoDB role-based access control for extra security

---

**Your University Cafe Management System is now fully role-enabled with email notifications!** 🎊✨

Need help? Check the troubleshooting section or review backend logs for debugging.
