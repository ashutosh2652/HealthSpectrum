# HealthSpectrum

HealthSpectrum is a comprehensive healthcare document management and analysis system that helps healthcare providers manage patient documents, analyze medical records, and generate insights.

## 🌟 Features

- **User Authentication & Authorization**

  - Secure login and registration system
  - Role-based access control
  - JWT-based authentication

- **Patient Management**

  - Link patients to healthcare providers
  - Manage patient profiles and records
  - Secure access to patient information

- **Document Management**

  - Upload and store medical documents
  - Cloud storage integration with Cloudinary
  - Support for multiple document formats

- **Medical Analysis**

  - Automated analysis of medical documents
  - Condition detection and risk assessment
  - Medication tracking and test result analysis
  - Generate comprehensive medical reports

- **Interactive Dashboard**
  - Modern, responsive UI
  - Real-time updates
  - Intuitive navigation
  - Dark/Light theme support

## 🛠️ Technology Stack

### Frontend (Client)

- **Framework**: React 18 with TypeScript
- **Styling**:
  - Tailwind CSS
  - Shadcn/ui components
  - Responsive design
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**:
  - Radix UI primitives
  - Recharts for data visualization
  - Framer Motion for animations
- **Build Tool**: Vite

### Backend (Server)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Security**:
  - Helmet for security headers
  - CORS protection
  - Password hashing with bcrypt

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Cloudinary account

### Installation

1. Clone the repository

```bash
git clone https://github.com/ashutosh2652/HealthSpectrum.git
cd HealthSpectrum
```

2. Install dependencies for both client and server

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables

Create a `.env` file in the server directory:

```env
PORT=8000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the development servers

In the server directory:

```bash
npm run dev
```

In the client directory:

```bash
npm run dev
```

## 📁 Project Structure

```
HealthSpectrum/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Reusable components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Application pages
│   │   └── App.tsx       # Main application component
│   └── package.json
│
└── server/                # Backend application
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── middleware/   # Express middleware
    │   ├── models/       # Mongoose models
    │   ├── routes/       # API routes
    │   ├── utils/        # Utility functions
    │   └── app.js        # Express application setup
    └── package.json
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing
- Protected API routes
- Secure file upload handling
- Input validation and sanitization
- Role-based access control
- Secure HTTP headers with Helmet

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Ashutosh** - _Initial work_

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [MongoDB](https://www.mongodb.com/) for the database
- [Cloudinary](https://cloudinary.com/) for media management
