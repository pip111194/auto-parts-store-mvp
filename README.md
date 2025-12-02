# 🚗 Auto Parts Store - Mobile App MVP

A comprehensive mobile application for auto parts inventory and store management with real-time updates.

## 🎯 Features

### Admin Panel
- ✅ Secure authentication with JWT
- ✅ Dashboard with inventory summary
- ✅ Complete CRUD operations for parts
- ✅ Real-time stock updates
- ✅ Image upload with Cloudinary
- ✅ Low stock alerts
- ✅ Search and filter parts

### Customer Interface
- ✅ Browse parts catalog
- ✅ Advanced search functionality
- ✅ Real-time stock availability
- ✅ Product details with images
- ✅ Category-based browsing
- ✅ Responsive mobile design

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with bcrypt
- **Real-time:** Socket.io
- **File Upload:** Multer + Cloudinary
- **Validation:** express-validator

### Frontend
- **Framework:** React Native (Expo)
- **State Management:** Redux Toolkit + RTK Query
- **Navigation:** React Navigation v6
- **UI Library:** React Native Paper
- **Real-time:** Socket.io Client

## 📁 Project Structure

```
auto-parts-store-mvp/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   ├── .env.example
│   └── package.json
│
└── mobile/                  # React Native App
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── screens/        # App screens
    │   ├── navigation/     # Navigation setup
    │   ├── store/          # Redux store
    │   ├── services/       # API services
    │   └── utils/          # Utility functions
    ├── App.js
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- MongoDB (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)
- Cloudinary account (for image uploads)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Configure environment variables:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/autoparts
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=24h
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

5. **Start the server:**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Mobile App Setup

1. **Navigate to mobile directory:**
```bash
cd mobile
```

2. **Install dependencies:**
```bash
npm install
```

3. **Update API URL:**
Edit `src/config/api.js` and set your backend URL:
```javascript
export const API_URL = 'http://YOUR_IP:5000/api/v1';
```

4. **Start Expo:**
```bash
npm start
```

5. **Run on device:**
- Scan QR code with Expo Go app (iOS/Android)
- Or press `a` for Android emulator
- Or press `i` for iOS simulator

## 📱 Default Admin Credentials

After first run, a default admin account is created:
- **Email:** admin@autoparts.com
- **Password:** Admin@123

⚠️ **Change these credentials immediately in production!**

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/login              - Admin login
POST   /api/v1/auth/refresh-token      - Refresh JWT token
POST   /api/v1/auth/logout             - Logout
```

### Parts Management
```
GET    /api/v1/parts                   - List all parts (with filters)
GET    /api/v1/parts/:id               - Get single part
POST   /api/v1/parts                   - Create new part (Admin)
PUT    /api/v1/parts/:id               - Update part (Admin)
DELETE /api/v1/parts/:id               - Delete part (Admin)
GET    /api/v1/parts/search/:query     - Search parts
```

### Dashboard
```
GET    /api/v1/dashboard/summary       - Dashboard statistics (Admin)
GET    /api/v1/dashboard/low-stock     - Low stock alerts (Admin)
```

### Categories
```
GET    /api/v1/categories              - List all categories
POST   /api/v1/categories              - Create category (Admin)
```

### Image Upload
```
POST   /api/v1/upload/image            - Upload single image (Admin)
```

## 🔄 Real-time Features

The app uses Socket.io for real-time updates:

- **Stock Updates:** When admin updates stock, customers see changes instantly
- **New Parts:** New parts appear in customer feed immediately
- **Price Changes:** Price updates reflect in real-time
- **Low Stock Alerts:** Admins get instant notifications

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Mobile Tests
```bash
cd mobile
npm test
```

## 📦 Building for Production

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Mobile App Build

**Android APK:**
```bash
cd mobile
expo build:android
```

**iOS IPA:**
```bash
cd mobile
expo build:ios
```

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected admin routes
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Helmet.js security headers

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/customer),
  createdAt: Date
}
```

### Part Model
```javascript
{
  name: String,
  partNumber: String (unique),
  brand: String,
  category: ObjectId (ref: Category),
  price: Number,
  costPrice: Number,
  quantity: Number,
  minStockLevel: Number,
  images: [String],
  description: String,
  specifications: Object,
  vehicleCompatibility: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model
```javascript
{
  name: String,
  description: String,
  image: String,
  parentCategory: ObjectId (ref: Category),
  isActive: Boolean
}
```

## 🎨 UI Screenshots

*(Screenshots will be added after UI implementation)*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Anand Rathore** - Initial work

## 🙏 Acknowledgments

- React Native community
- Express.js team
- MongoDB team
- All open-source contributors

## 📞 Support

For support, email rathoreanand9198@gmail.com or open an issue in the repository.

---

**Built with ❤️ using React Native and Node.js**
