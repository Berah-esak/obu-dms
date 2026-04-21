# 🚀 How to Run the System

## ✅ System is Currently Running!

### Access URLs
- **Frontend (Student Dashboard)**: http://localhost:8081
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## 📋 Current Status

✅ **Backend Server**: Running on port 5000  
✅ **Frontend Server**: Running on port 8081  
✅ **Firebase/Firestore**: Connected to project `obu-9741c`  
✅ **Exit Clearance Feature**: Fully functional on student dashboard

---

## 🔐 Test Credentials

### System Admin
- **Username**: `admin`
- **Password**: `Admin@2026`
- **Email**: `admin@gmail.com`

### Dorm Admin (Proctor Head)
- **Username**: `dormadmin`
- **Password**: `Dormadmin@2026`
- **Email**: `dormadmin@gmail.com`

### Maintenance Staff
- **Username**: `maint_mark`
- **Password**: `Admin@2026`
- **Email**: `mark@gmail.com`

### Students
- **Username**: `sam.student` or `sally.student`
- **Password**: `Admin@2026`
- **Email**: `sam@gmail.com` or `sally@gmail.com`

---

## 🎯 How to Use Exit Clearance Feature

### As a Student:

1. **Login**
   - Go to http://localhost:8081
   - Login with student credentials (e.g., `sam.student` / `Admin@2026`)

2. **Submit Exit Request**
   - Scroll down to "Request Exit Clearance" section
   - Click "Add Item" to add items you're carrying
   - Enter items like: "Laptop", "Backpack", "Books"
   - Enter reason for exit (e.g., "Going home for weekend")
   - Click "Submit Exit Request"

3. **View Request Status**
   - Check "My Exit Requests" section below the form
   - Status will show as:
     - 🟡 **Pending** - Waiting for approval
     - 🟢 **Approved** - Code generated (see below)
     - 🔴 **Rejected** - See rejection reason
     - 🔵 **Verified** - Code was used at gate

4. **Get Verification Code**
   - When approved, you'll see a green box with your code
   - Example: `A3F7B2C9`
   - Click the copy button to copy the code
   - Show this code at the gate

5. **At the Gate**
   - Show the verification code to the gate guard
   - Guard will verify the code
   - Status will change to "Verified"
   - Code can only be used once

---

## 🛠️ If You Need to Restart

### Stop the Servers
If servers are running in background, you can stop them from VS Code terminal or:
```powershell
# Find processes using ports
Get-NetTCPConnection -LocalPort 5000
Get-NetTCPConnection -LocalPort 8081

# Stop processes (replace <PID> with actual process ID)
Stop-Process -Id <PID> -Force
```

### Start Backend
```bash
cd backend
npm start
```
**Expected Output:**
```
[INFO] Firestore connection established
[INFO] DMS API listening on port 5000
```

### Start Frontend
```bash
npm run dev
```
**Expected Output:**
```
VITE v5.4.19  ready in 271 ms
➜  Local:   http://localhost:8081/
```

---

## 🔍 Verify System is Working

### 1. Check Backend Health
Open browser or use curl:
```
http://localhost:5000/api/health
```
Should return:
```json
{
  "success": true,
  "message": "DMS API is healthy",
  "data": {
    "status": "ok",
    "timestamp": "2026-04-21T13:54:27.908Z"
  }
}
```

### 2. Check Frontend
Open browser:
```
http://localhost:8081
```
Should show the login page.

### 3. Test Exit Clearance
1. Login as student
2. Scroll to exit clearance section
3. Submit a test request
4. Verify it appears in the list below

---

## 📊 Firebase Configuration

Your system is connected to:
- **Project ID**: `obu-9741c`
- **Auth Domain**: `obu-9741c.firebaseapp.com`
- **Storage**: `obu-9741c.firebasestorage.app`

Backend uses Firebase Admin SDK for server-side operations.
Frontend uses Firebase Client SDK for authentication (if needed).

---

## 🐛 Troubleshooting

### Backend Won't Start
**Error**: "Port 5000 is in use"
```powershell
# Find and kill process
Get-NetTCPConnection -LocalPort 5000
Stop-Process -Id <PID> -Force
```

### Frontend Won't Start
**Error**: "Port 8080 is in use"
- Vite will automatically try port 8081, 8082, etc.
- Check the terminal output for the actual port

### Firebase Connection Error
**Error**: "Firestore not initialised"
- Check `backend/.env` file exists
- Verify Firebase credentials are correct
- Make sure private key has proper line breaks (`\n`)

### Exit Clearance Not Showing
1. Clear browser cache
2. Hard refresh (Ctrl + Shift + R)
3. Check browser console for errors (F12)
4. Verify you're logged in as a student

### API Errors
**Error**: "Network error"
- Check backend is running on port 5000
- Check `VITE_API_URL` in frontend (should be `http://localhost:5000/api`)
- Check CORS settings in backend

---

## 📁 Project Structure

```
odu-dms/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # API controllers
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Database operations
│   │   ├── routes/            # API routes
│   │   ├── middlewares/       # Auth, error handling
│   │   └── utils/             # Utilities
│   ├── .env                   # Environment variables
│   └── server.js              # Entry point
│
├── src/                       # React/TypeScript frontend
│   ├── components/            # React components
│   │   ├── ExitRequestForm.tsx
│   │   └── ExitRequestList.tsx
│   ├── pages/                 # Page components
│   │   └── DashboardPage.tsx
│   ├── lib/                   # Utilities
│   │   └── api.ts             # API service
│   └── types/                 # TypeScript types
│
└── docs/                      # Documentation
```

---

## 🎉 Features Available

### ✅ Implemented
- User authentication (JWT)
- Role-based access control
- Student dashboard
- Room allocation
- Maintenance requests
- Room change requests
- Notifications
- **Exit Clearance System** (NEW!)
  - Submit exit requests
  - Real-time status tracking
  - Verification code generation
  - Gate verification
  - Notification system

### 🚧 Planned (From Spec)
- Proctor role management
- Attendance tracking
- Material inventory
- Announcement system
- Complaint management
- Enhanced maintenance workflow

---

## 📞 Need Help?

If you encounter any issues:
1. Check the terminal output for error messages
2. Check browser console (F12) for frontend errors
3. Verify Firebase credentials in `backend/.env`
4. Make sure both servers are running
5. Try restarting both servers

---

## 🎯 Quick Test Scenario

**Complete Exit Clearance Flow:**

1. **Login as Student** (`sam.student` / `Admin@2026`)
2. **Submit Request**:
   - Items: "Laptop, Backpack, Phone"
   - Reason: "Going home for weekend"
3. **Check Status**: Should show "Pending" 🟡
4. **Login as Dorm Admin** (`dormadmin` / `Dormadmin@2026`)
5. **Approve Request** (via API or admin dashboard)
6. **Login as Student Again**
7. **View Code**: Should show verification code 🟢
8. **Copy Code**: Click copy button
9. **Verify at Gate** (via API or gate guard interface)
10. **Check Status**: Should show "Verified" 🔵

---

**System is ready to use! 🚀**

Access the student dashboard at: http://localhost:8081
