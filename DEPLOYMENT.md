# CareerNest Deployment Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- Gmail account with App Password for email services
- Cloudinary account for file uploads
- Google OAuth credentials
- Gemini API key for AI features

## Environment Setup

### Backend Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

```bash
# MongoDB Configuration
MONGO_URI=your_mongodb_connection_string

# Server Configuration
PORT=3000
SECRET_KEY=your_jwt_secret_key

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend Environment Variables

Copy `frontend/.env.example` to `frontend/.env` and configure:

```bash
# Backend API URL
VITE_API_URL=http://localhost:3000/api/v1

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Local Development

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

### Backend (Render/Railway/Heroku)

1. Set environment variables in your hosting platform
2. Set `NODE_ENV=production`
3. Update `FRONTEND_URL` to your production frontend URL
4. Deploy using `npm start`

### Frontend (Netlify/Vercel)

1. Set environment variables in your hosting platform
2. Update `VITE_API_URL` to your production backend URL
3. Build and deploy using `npm run build`

## Security Checklist

- [ ] All sensitive data moved to environment variables
- [ ] `.env` files added to `.gitignore`
- [ ] CORS configured for production domains only
- [ ] JWT secret is strong and unique
- [ ] Gmail App Password configured (not regular password)
- [ ] MongoDB connection uses authentication
- [ ] Rate limiting implemented (recommended)

## Troubleshooting

### Email Issues
- Ensure Gmail App Password is used, not regular password
- Check Gmail 2FA is enabled
- Verify EMAIL_USER and EMAIL_PASS are correct

### Database Issues
- Verify MongoDB connection string format
- Check network access in MongoDB Atlas
- Ensure database user has proper permissions

### OAuth Issues
- Verify Google OAuth credentials
- Check authorized redirect URIs
- Ensure client IDs match between frontend and backend