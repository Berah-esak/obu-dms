# 🏠 Dormitory Management System (DMS)

A comprehensive web-based dormitory management system built for educational institutions to manage student housing, room assignments, maintenance requests, and administrative tasks.

## 🌟 Features

### 👨‍🎓 Student Portal
- **Room Assignment View** - See assigned room details and roommate information
- **Maintenance Requests** - Submit and track maintenance requests with photo attachments
- **Exit Clearance** - Request exit clearance with item verification
- **Profile Management** - Update personal information and contact details
- **Notifications** - Receive updates on requests and announcements

### 👨‍💼 Admin Dashboard
- **Student Management** - Add, edit, and manage student records
- **Room Assignment** - Assign students to rooms with automatic allocation
- **Maintenance Management** - Review, approve, and track maintenance requests
- **Exit Clearance Processing** - Approve/reject exit requests with verification
- **Inventory Management** - Track furniture, linens, and key assignments
- **Reports & Analytics** - Generate occupancy and maintenance reports
- **User Management** - Manage staff accounts and permissions

### 🔧 Maintenance Staff Portal
- **Task Management** - View assigned maintenance tasks
- **Status Updates** - Update work progress and completion status
- **Resource Tracking** - Log materials and time spent

### 🏢 Management Features
- **System Settings** - Configure system parameters and policies
- **Audit Logs** - Track all system activities and changes
- **Notifications** - Broadcast announcements to users
- **Role-based Access** - Granular permission control

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Firebase Firestore** - NoSQL database
- **Firebase Admin SDK** - Authentication and database access
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Joi** - Data validation
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Shadcn/ui** - UI component library
- **React Router** - Client-side routing
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Database
- **Firebase Firestore** - Document-based NoSQL database
- **Collections**: Users, Students, Rooms, Assignments, Maintenance Requests, Exit Requests, Notifications, Audit Logs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:Berah-esak/obu-dms.git
   cd obu-dms
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Generate a service account key
   - Update `backend/.env` with your Firebase credentials:
   
   ```env
   PORT=5001
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=*
   
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_PRIVATE_KEY="your_private_key"
   ```

4. **Configure Frontend**
   ```env
   # .env
   VITE_API_URL=http://localhost:5001/api
   ```

5. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

6. **Start the application**
   ```bash
   # Start backend (in backend directory)
   npm run dev
   
   # Start frontend (in root directory)
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## 👥 Default Users

After seeding, you can login with these accounts:

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| System Admin | `admin` | `Admin@2026` | Full system access |
| Dorm Admin | `dormadmin` | `Dormadmin@2026` | Dormitory management |
| Maintenance | `maint_mark` | `Admin@2026` | Maintenance tasks |
| Student | `sam.student` | `Admin@2026` | Student portal |
| Student | `sally.student` | `Admin@2026` | Student portal |

## 📁 Project Structure

```
obu-dms/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Express middlewares
│   │   ├── models/         # Database models
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── validators/     # Input validation
│   ├── package.json
│   └── server.js           # Entry point
├── src/                    # Frontend React app
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and API client
│   ├── pages/             # Page components
│   └── types/             # TypeScript types
├── public/                # Static assets
├── docs/                  # Documentation
└── package.json
```

## 🔐 Authentication & Authorization

The system uses JWT-based authentication with role-based access control:

- **Students** - Can view their assignments, submit requests, manage profile
- **Dorm Admin** - Can manage students, rooms, approve requests
- **Maintenance Staff** - Can view and update assigned maintenance tasks
- **Management** - Can access reports and system analytics
- **System Admin** - Full system access and user management

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - Student registration
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Student Endpoints
- `GET /api/student/profile` - Get student profile
- `GET /api/student/assignment` - Get room assignment
- `GET /api/student/maintenance-requests` - Get maintenance history

### Maintenance Endpoints
- `POST /api/maintenance-requests` - Submit maintenance request
- `GET /api/maintenance-requests` - Get all requests (admin)
- `PUT /api/maintenance-requests/:id/approve` - Approve request
- `PUT /api/maintenance-requests/:id/reject` - Reject request
- `PUT /api/maintenance-requests/:id/status` - Update status

### Room Management
- `GET /api/rooms` - Get rooms with filters
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/:id` - Update room
- `GET /api/rooms/available` - Get available rooms

[View complete API documentation](docs/API_REFERENCE.md)

## 🧪 Testing

### Manual Testing
1. Start both backend and frontend servers
2. Login with different user roles
3. Test each feature workflow:
   - Student: Submit maintenance request
   - Admin: Approve/reject requests
   - Maintenance: Update task status

### Test Scenarios
- Room assignment and display
- Maintenance request workflow
- Exit clearance process
- User authentication and authorization
- File upload functionality

## 📈 Features Roadmap

### Phase 1 (Completed) ✅
- [x] User authentication and authorization
- [x] Student room assignments
- [x] Maintenance request system
- [x] Admin dashboard
- [x] Role-based access control

### Phase 2 (In Progress)
- [ ] Exit clearance system
- [ ] Inventory management
- [ ] Notification system
- [ ] Report generation

### Phase 3 (Planned)
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced analytics
- [ ] Integration with student information systems
- [ ] Automated room allocation algorithms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Check the [documentation](docs/) folder
- Review the [troubleshooting guide](docs/TROUBLESHOOTING.md)

## 🙏 Acknowledgments

- Built for educational institutions to streamline dormitory management
- Inspired by modern web development best practices
- Uses Firebase for reliable cloud infrastructure
- Designed with accessibility and user experience in mind

---

**Built with ❤️ for better dormitory management**