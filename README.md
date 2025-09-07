# HealthSpectrum

A modern health analysis and reporting system built with the MERN stack.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/HealthSpectrum-1.git
cd HealthSpectrum-1
```

2. Install Server Dependencies
```bash
cd server
npm install
```

3. Install Client Dependencies
```bash
cd ../client
npm install
```

4. Set up Environment Variables

Server (.env):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthspectrum
CORS_ORIGIN=http://localhost:5173
```

Client (.env):
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

5. Start Development Servers

Server:
```bash
cd server
npm run dev
```

Client:
```bash
cd client
npm run dev
```

## 🛠️ Tech Stack

### Frontend
- React with TypeScript
- Redux Toolkit
- Tailwind CSS
- Framer Motion
- Clerk Authentication

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication

## 📁 Project Structure

```
HealthSpectrum-1/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store configuration
│   │   └── types/        # TypeScript type definitions
│   └── ...
└── server/                # Backend Node.js application
    ├── src/
    │   ├── controllers/   # Route controllers
    │   ├── models/       # Database models
    │   ├── routes/       # API routes
    │   └── utils/        # Utility functions
    └── ...
```

## 🔐 Authentication

This project uses Clerk for authentication. Make sure to:
1. Set up a Clerk account
2. Configure your application
3. Add the required environment variables

## 📄 API Documentation

API endpoints are documented in the server's README file.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.