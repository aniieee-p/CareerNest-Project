# 🌟 CareerNest – Smart Job Portal

<div align="center">

![CareerNest Logo](frontend/public/careernest-favicon-glass.svg)

**A modern MERN stack job portal connecting talented job seekers with recruiters**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://careernest-anisha.netlify.app)
[![Backend API](https://img.shields.io/badge/API-Documentation-blue)](https://careernest-y43o.onrender.com)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

</div>

🚀 **CareerNest** is where talent meets opportunity in the digital age. Built with cutting-edge MERN stack technology, this intelligent job portal revolutionizes how professionals connect with their dream careers and how companies discover exceptional talent.

**🌟 More than just a job board** - CareerNest is your AI-powered career companion that understands your aspirations, learns from your preferences, and guides you toward meaningful professional growth. Whether you're a job seeker ready to take the next step or a recruiter searching for the perfect candidate, our platform creates meaningful connections that drive success.

**✨ What makes us different:**
- 🤖 **Smart AI Matching** - Google Gemini-powered recommendations that get smarter with every interaction
- 📊 **Data-Driven Insights** - Real-time analytics to optimize your job search or hiring strategy  
- 🔐 **Seamless Experience** - One-click Google OAuth and intuitive design that just works
- ☁️ **Enterprise Ready** - Scalable cloud infrastructure with professional-grade security
- 📧 **Stay Connected** - Intelligent notifications that keep you informed without overwhelming you

*Transforming careers, one connection at a time.*
- ☁️ **Cloud Storage** with Cloudinary
- 📧 **Email Notifications** system
- 📱 **Fully Responsive** design with modern UI components

---

# 🖥️ Demo Preview

🚀 **Live Demo**: [CareerNest Live](https://careernest-anisha.netlify.app)

📱 **Backend API**: [API Documentation](https://careernest-y43o.onrender.com)

> **Note**: The backend may take 30-60 seconds to wake up on first request due to free hosting limitations.

---

# ✨ Key Features

## 👩‍💻 For Job Seekers
- 🔐 **Secure Authentication** - JWT-based login with Google OAuth support
- 🔎 **Smart Job Search** - Advanced filtering by location, skills, salary, and company
- 📄 **Easy Applications** - One-click job applications with resume upload
- 📊 **Application Tracking** - Real-time status updates and notifications
- ⭐ **Job Management** - Save favorite jobs and manage applied positions
- 👤 **Profile Management** - Comprehensive profile with skills and experience
- 🤖 **AI Career Advice** - Personalized recommendations powered by Google Gemini
- 📧 **Email Notifications** - Stay updated on application status changes

## 🏢 For Recruiters
- 🔑 **Recruiter Dashboard** - Comprehensive admin panel for job management
- 📝 **Job Posting** - Create detailed job listings with rich descriptions
- ✏️ **Job Management** - Edit, update, or remove job postings
- 👀 **Candidate Review** - View and filter applicant profiles
- 📋 **Application Management** - Track and update application statuses
- 🏢 **Company Profiles** - Manage company information and branding
- 📊 **Analytics Dashboard** - Track job performance and applicant metrics
- 🔍 **Candidate Search** - Find potential candidates proactively

## ⚙️ Platform Features
- 🔒 **Enterprise Security** - JWT authentication with bcrypt password hashing
- ⚡ **High Performance** - Optimized APIs with rate limiting and caching
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🌙 **Dark Mode Support** - Toggle between light and dark themes
- � **Real-time Analytics** - PulseIQ integration for user behavior tracking
- � **File Management** - Cloudinary integration for resume and image uploads
- 🔎 **Advanced Search** - Full-text search with multiple filter options
- � **Email System** - Automated notifications and communication
- 🤖 **AI Integration** - Google Gemini for intelligent features

---

# 🛠️ Tech Stack

<div align="center">

| **Frontend** | **Backend** | **Database** | **Services** |
|:---:|:---:|:---:|:---:|
| ![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react) | ![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?logo=node.js) | ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb) | ![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?logo=cloudinary) |
| ![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite) | ![Express](https://img.shields.io/badge/Express.js-5.2.1-000000?logo=express) | ![Mongoose](https://img.shields.io/badge/Mongoose-9.2.1-880000?logo=mongoose) | ![Google AI](https://img.shields.io/badge/Google_AI-Gemini-4285F4?logo=google) |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind-4.2.1-06B6D4?logo=tailwindcss) | ![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens) | | ![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-339933?logo=nodemailer) |

</div>

### 🎨 Frontend Technologies
- **⚛️ React 19.2.0** - Modern UI library with latest features
- **⚡ Vite 7.3.1** - Lightning-fast build tool and dev server
- **🎨 Tailwind CSS 4.2.1** - Utility-first CSS framework
- **🧭 React Router DOM 7.13.1** - Client-side routing
- **� Redux Toolkit** - State management with Redux Persist
- **🎭 Framer Motion** - Smooth animations and transitions
- **🎯 Radix UI** - Accessible component primitives
- **🌙 Next Themes** - Dark/light mode support
- **📱 Lucide React** - Beautiful icon library

### 🚀 Backend Technologies
- **🟢 Node.js** - JavaScript runtime environment
- **🚀 Express.js 5.2.1** - Web application framework
- **🍃 MongoDB** - NoSQL database with Mongoose ODM
- **🔐 JWT** - JSON Web Token authentication
- **🔒 bcryptjs** - Password hashing
- **� Nodemailer** - Email service integration
- **☁️ Cloudinary** - Cloud-based image and video management
- **🤖 Google Generative AI** - AI-powered features
- **📊 PulseIQ** - Analytics and tracking
- **🛡️ Express Rate Limit** - API rate limiting

### 🔧 Development Tools
- **📦 npm** - Package management
- **🔧 Nodemon** - Development server auto-restart
- **🧹 ESLint** - Code linting and formatting
- **📄 Multer** - File upload handling

---

# 📁 Project Structure

```
CareerNest/
│
├── 📁 backend/                 # Node.js Express API Server
│   ├── 📁 controllers/         # Business logic & request handlers
│   │   ├── ai.controller.js           # AI-powered features
│   │   ├── application.controller.js  # Job application management
│   │   ├── company.controller.js      # Company profile management
│   │   ├── job.controller.js          # Job posting & search
│   │   ├── notification.controller.js # Real-time notifications
│   │   └── user.controller.js         # User authentication & profiles
│   │
│   ├── 📁 models/              # MongoDB schemas with Mongoose
│   │   ├── application.model.js       # Job application schema
│   │   ├── company.model.js           # Company profile schema
│   │   ├── job.model.js               # Job posting schema
│   │   ├── notification.model.js      # Notification schema
│   │   └── user.model.js              # User profile schema
│   │
│   ├── 📁 routes/              # API endpoint definitions
│   ├── 📁 middlewares/         # Authentication & validation
│   │   ├── isAuthenticated.js         # JWT token verification
│   │   ├── isRecruiter.js             # Role-based access control
│   │   └── multer.js                  # File upload handling
│   │
│   ├── 📁 utils/               # Helper functions & services
│   │   ├── cloudinary.js              # Image/file upload service
│   │   ├── datauri.js                 # File format conversion
│   │   ├── db.js                      # Database connection
│   │   ├── mailer.js                  # Email service
│   │   └── pulseiq.js                 # Analytics integration
│   │
│   ├── 📄 .env.example         # Environment variables template
│   ├── 📄 package.json         # Dependencies & scripts
│   └── 📄 index.js             # Server entry point
│
├── 📁 frontend/                # React.js Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 components/      # Reusable UI components
│   │   │   ├── 📁 admin/              # Recruiter dashboard components
│   │   │   ├── 📁 auth/               # Authentication components
│   │   │   ├── 📁 shared/             # Common components (Navbar, Footer)
│   │   │   └── 📁 ui/                 # Base UI components (shadcn/ui)
│   │   │
│   │   ├── 📁 hooks/           # Custom React hooks
│   │   │   ├── useGetAllJobs.jsx      # Job fetching hook
│   │   │   ├── useGetNotifications.jsx # Notification management
│   │   │   └── usePulseIQ.jsx         # Analytics tracking hook
│   │   │
│   │   ├── 📁 redux/           # State management
│   │   │   ├── authSlice.js           # Authentication state
│   │   │   ├── jobSlice.js            # Job-related state
│   │   │   ├── applicationSlice.js    # Application state
│   │   │   └── store.js               # Redux store configuration
│   │   │
│   │   ├── 📁 utils/           # Helper functions
│   │   │   ├── axiosInstance.js       # API client configuration
│   │   │   ├── constant.js            # App constants
│   │   │   └── pulseiq.js             # Analytics utilities
│   │   │
│   │   ├── 📄 App.jsx          # Main application component
│   │   ├── 📄 main.jsx         # React entry point
│   │   └── 📄 index.css        # Global styles
│   │
│   ├── 📁 public/              # Static assets
│   ├── 📄 .env.example         # Environment variables template
│   ├── 📄 package.json         # Dependencies & scripts
│   ├── 📄 vite.config.js       # Vite configuration
│   └── 📄 tailwind.config.js   # Tailwind CSS configuration
│
├── 📄 DEPLOYMENT.md            # Comprehensive deployment guide
├── 📄 README.md                # Project documentation
└── 📄 .gitignore               # Git ignore rules
```

## 🏗️ Architecture Overview

**CareerNest** follows a **modern full-stack architecture**:

- **Frontend**: React SPA with Vite for fast development and optimized builds
- **Backend**: RESTful API built with Express.js and Node.js
- **Database**: MongoDB with Mongoose ODM for flexible data modeling
- **Authentication**: JWT-based auth with Google OAuth integration
- **File Storage**: Cloudinary for scalable media management
- **State Management**: Redux Toolkit with persistence
- **Styling**: Tailwind CSS with shadcn/ui components
- **Analytics**: PulseIQ integration for user behavior tracking

---

# ⚡ Quick Start

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/aniieee-p/CareerNest.git
cd CareerNest
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

**Configure Environment Variables:**
```bash
cp .env.example .env
```

Edit `.env` file with your credentials:
```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/careernest

# Server Configuration
PORT=3000
SECRET_KEY=your_super_secret_jwt_key

# Cloudinary Configuration (for file uploads)
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Analytics (Optional)
PULSEIQ_API_KEY=your_pulseiq_api_key
PULSEIQ_PROJECT_ID=your_project_id
```

**Start Backend Server:**
```bash
npm run dev
```
Backend will run on `http://localhost:3000`

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

**Configure Environment Variables:**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api/v1

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Analytics (Optional)
VITE_PULSEIQ_API_KEY=your_pulseiq_api_key
VITE_PULSEIQ_PROJECT_ID=your_project_id
```

**Start Frontend Development Server:**
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

### 4️⃣ Access the Application

- **🌐 Frontend**: http://localhost:5173
- **🔧 Backend API**: http://localhost:3000
- **📚 API Documentation**: http://localhost:3000/api/v1

## � Docker Setup (Optional)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## �📖 Additional Setup

**For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

### Required External Services:
1. **MongoDB Atlas** - Database hosting
2. **Cloudinary** - File storage and image optimization
3. **Gmail App Password** - Email notifications
4. **Google Cloud Console** - OAuth and Gemini AI
5. **PulseIQ** (Optional) - Analytics tracking

---

# 🌱 Future Enhancements

CareerNest is designed for continuous improvement. Here are planned features and enhancements:

## 🤖 AI & Machine Learning
- **Smart Job Matching** - AI-powered job recommendations based on user profiles
- **Resume Analysis** - Automated resume parsing and skill extraction
- **Interview Preparation** - AI-generated interview questions and tips
- **Salary Prediction** - ML models for salary range estimation
- **Skill Gap Analysis** - Identify missing skills for desired positions

## � Advanced Analytics
- **Recruiter Dashboard** - Comprehensive hiring analytics and metrics
- **Market Insights** - Job market trends and salary benchmarks
- **Performance Tracking** - Application success rates and optimization tips
- **A/B Testing** - Feature experimentation and optimization

## � Platform Enhancements
- **Video Interviews** - Integrated video calling for remote interviews
- **Calendar Integration** - Automated interview scheduling
- **Mobile App** - Native iOS and Android applications
- **Multi-language Support** - Internationalization for global reach
- **Advanced Search** - Elasticsearch integration for better search

## 🏢 Enterprise Features
- **Company Pages** - Detailed company profiles and culture insights
- **Team Collaboration** - Multi-recruiter workflow management
- **API Access** - RESTful APIs for third-party integrations
- **White-label Solution** - Customizable branding for enterprises
- **Advanced Permissions** - Role-based access control system

## 🔐 Security & Performance
- **Two-Factor Authentication** - Enhanced security measures
- **Rate Limiting** - Advanced API protection
- **CDN Integration** - Global content delivery
- **Microservices** - Scalable architecture migration
- **Real-time Features** - WebSocket integration for live updates

## � User Experience
- **Progressive Web App** - Offline functionality and app-like experience
- **Accessibility** - WCAG 2.1 AA compliance
- **Personalization** - Customizable dashboards and preferences
- **Social Features** - Professional networking capabilities
- **Gamification** - Achievement system and progress tracking

---

# 🤝 Contributing

We welcome contributions from the community! CareerNest is an open-source project that benefits from diverse perspectives and expertise.

## 🚀 How to Contribute

### 1️⃣ Fork & Clone
```bash
# Fork the repository on GitHub
git clone https://github.com/your-username/CareerNest.git
cd CareerNest
```

### 2️⃣ Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3️⃣ Make Changes
- Follow the existing code style and conventions
- Add tests for new features when applicable
- Update documentation as needed
- Ensure your code passes all existing tests

### 4️⃣ Commit & Push
```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

### 5️⃣ Create Pull Request
- Open a pull request with a clear title and description
- Reference any related issues
- Wait for code review and address feedback

## 📋 Contribution Guidelines

### Code Style
- Use **ESLint** configuration provided in the project
- Follow **React** and **Node.js** best practices
- Write **clear, descriptive commit messages**
- Add **comments** for complex logic

### Areas for Contribution
- 🐛 **Bug Fixes** - Help identify and fix issues
- ✨ **New Features** - Implement planned enhancements
- 📚 **Documentation** - Improve README, comments, and guides
- 🎨 **UI/UX** - Enhance user interface and experience
- 🧪 **Testing** - Add unit and integration tests
- 🔧 **Performance** - Optimize code and database queries

### Reporting Issues
- Use GitHub Issues to report bugs
- Provide detailed reproduction steps
- Include screenshots for UI issues
- Specify your environment (OS, browser, Node.js version)

## 🏆 Contributors

Thanks to all the amazing contributors who help make CareerNest better!

<!-- Contributors will be automatically added here -->

## 📞 Get Help

- 💬 **Discussions** - Use GitHub Discussions for questions
- 🐛 **Issues** - Report bugs via GitHub Issues
- 📧 **Email** - Contact the maintainer directly

Your contributions help make CareerNest a better platform for job seekers and recruiters worldwide!

---

# 👩‍💻 Author

<div align="center">

![Profile](https://github.com/aniieee-p.png?size=100)

**Anisha Patel**

🎓 B.Tech Computer Science Engineering Student  
💻 Passionate Full-Stack Developer & Problem Solver  
🚀 Building innovative solutions with modern technologies

[![GitHub](https://img.shields.io/badge/GitHub-aniieee--p-181717?logo=github)](https://github.com/aniieee-p)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Anisha_Patel-0A66C2?logo=linkedin)](https://linkedin.com/in/anisha-patel-642539272)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-FF5722?logo=web)](https://your-portfolio-url.com)

</div>

## 🎯 About the Developer

Anisha is a dedicated computer science student with a passion for creating impactful web applications. With expertise in the MERN stack and modern development practices, she focuses on building user-centric solutions that solve real-world problems.

**Specializations:**
- 🌐 Full-Stack Web Development (MERN Stack)
- 🤖 AI Integration & Machine Learning
- 📱 Responsive UI/UX Design
- ☁️ Cloud Services & Deployment
- 🔧 DevOps & Performance Optimization

---

# 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

# ⭐ Support the Project

If you find CareerNest helpful, please consider:

- ⭐ **Starring the repository** - It helps others discover the project
- 🐛 **Reporting issues** - Help us improve the platform
- 🤝 **Contributing** - Join our community of developers
- 📢 **Sharing** - Tell others about CareerNest

<div align="center">

**Made with ❤️ by [Anisha Patel](https://github.com/aniieee-p)**

*Connecting talent with opportunity, one job at a time.*

</div>
