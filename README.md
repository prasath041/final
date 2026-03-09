# FurnitureHub - Online Furniture Showroom & Booking Platform

A complete MERN Stack application for managing an online furniture showroom with booking capabilities.

## 🚀 Features

### User Features
- User Registration & Authentication
- Browse Furniture by Categories
- Search & Filter Products
- View Detailed Product Information
- Book Furniture Online
- Track Booking Status
- Manage Profile
- View Booking History

### Admin Features
- Admin Dashboard
- Manage Furniture Products (Add, Edit, Delete)
- Manage Categories
- Manage User Accounts
- View & Update Booking Status
- Update Payment Status

## 🛠️ Tech Stack

### Frontend
- React.js 18
- React Router DOM 6
- Axios
- React Icons
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## 📋 Prerequisites

Before running this application, make sure you have:
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone or Navigate to Project Directory
```bash
cd "e:\FURNITURE HUB"
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
The `.env` file is already created with default values:
- PORT=5000
- MONGODB_URI=mongodb://localhost:27017/furniturehub
- JWT_SECRET=your_jwt_secret_key_change_this_in_production
- NODE_ENV=development

**Important:** Change the JWT_SECRET before deploying to production!

#### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if MongoDB installed as service)
net start MongoDB

# Or start manually
mongod
```

#### Run Backend Server
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

Backend will run on: http://localhost:5000

### 3. Frontend Setup

#### Install Dependencies
Open a new terminal and run:
```bash
cd frontend
npm install
```

#### Run Frontend Application
```bash
npm start
```

Frontend will run on: http://localhost:3000

## 🎯 Running the Application

### Step-by-Step Guide

1. **Start MongoDB** (if not running)
   ```bash
   mongod
   ```

2. **Start Backend Server** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```
   Wait for message: "✅ MongoDB connected successfully" and "🚀 Server running on port 5000"

3. **Start Frontend Application** (Terminal 2)
   ```bash
   cd frontend
   npm start
   ```
   Application will automatically open at http://localhost:3000

## 👤 Default Users

### Create Admin User
After starting the application, you need to manually create an admin user:

1. Register a new user through the application UI
2. Connect to MongoDB:
   ```bash
   mongosh
   use furniturehub
   db.users.updateOne(
     { email: "admin@furniturehub.com" },
     { $set: { role: "admin" } }
   )
   ```

Or register with any email and update via MongoDB Compass or command line.

## 📁 Project Structure

```
FURNITURE HUB/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── categoryController.js
│   │   ├── furnitureController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Category.js
│   │   ├── Furniture.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── furnitureRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── AdminRoute.js
    │   │   ├── Footer.js/css
    │   │   ├── Navbar.js/css
    │   │   ├── PrivateRoute.js
    │   │   └── ProductCard.js/css
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── ManageBookings.js
    │   │   │   ├── ManageCategories.js
    │   │   │   ├── ManageFurniture.js
    │   │   │   ├── ManageUsers.js
    │   │   │   └── Admin.css
    │   │   ├── AdminDashboard.js/css
    │   │   ├── BookingPage.js/css
    │   │   ├── Home.js/css
    │   │   ├── Login.js/css
    │   │   ├── MyBookings.js/css
    │   │   ├── ProductDetail.js/css
    │   │   ├── Products.js/css
    │   │   ├── Profile.js/css
    │   │   └── Register.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js/css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update user profile

### Furniture
- GET `/api/furniture` - Get all furniture (with filters)
- GET `/api/furniture/:id` - Get single furniture
- POST `/api/furniture` - Create furniture (Admin)
- PUT `/api/furniture/:id` - Update furniture (Admin)
- DELETE `/api/furniture/:id` - Delete furniture (Admin)

### Categories
- GET `/api/categories` - Get all categories
- GET `/api/categories/:id` - Get single category
- POST `/api/categories` - Create category (Admin)
- PUT `/api/categories/:id` - Update category (Admin)
- DELETE `/api/categories/:id` - Delete category (Admin)

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings` - Get all bookings (Admin)
- GET `/api/bookings/my-bookings` - Get user bookings
- GET `/api/bookings/:id` - Get single booking
- PUT `/api/bookings/:id/status` - Update booking status (Admin)
- PUT `/api/bookings/:id/cancel` - Cancel booking

### Users
- GET `/api/users` - Get all users (Admin)
- GET `/api/users/:id` - Get user by ID (Admin)
- PUT `/api/users/:id` - Update user (Admin)
- DELETE `/api/users/:id` - Delete user (Admin)

## 🎨 Features Walkthrough

1. **User Registration/Login**: Create account or login
2. **Browse Products**: View all furniture with filters
3. **Product Details**: See detailed information and specifications
4. **Book Furniture**: Select quantity and delivery details
5. **Track Bookings**: View all your bookings and their status
6. **Admin Dashboard**: Manage all aspects of the platform

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes (Frontend & Backend)
- Role-based access control (User/Admin)
- Input validation

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MongoDB URI in `.env` file
- Verify MongoDB is accessible on port 27017

### Port Already in Use
- Backend: Change PORT in `.env` file
- Frontend: React will prompt to use different port

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notes

- Default admin role must be set manually in database
- Images are stored as URLs (external hosting recommended)
- Booking system automatically manages stock
- Payment integration is simulated (not actual payment gateway)

## 🚀 Future Enhancements

- Payment gateway integration
- Image upload functionality
- Email notifications
- Advanced search with AI
- Customer reviews and ratings
- Wishlist functionality
- Real-time notifications

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Support

For issues and questions, please check:
- Backend logs in terminal
- Browser console for frontend errors
- MongoDB connection status

---

**Happy Coding! 🎉**
