# Deployment Guide

## Backend (Already Deployed)
✅ **Backend**: https://property-management-system-0uoy.onrender.com

## Frontend Deployment to Vercel

### 1. Admin Frontend (Next.js)
**Repository**: `admin` folder

**Steps**:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import the GitHub repository
4. Select the `admin` folder as the root directory
5. Configure environment variables:
   - `NEXT_PUBLIC_SERVER_BASE_URL`: `https://property-management-system-0uoy.onrender.com`
   - All other environment variables from `.env` file
6. Click "Deploy"

**Expected URL**: `https://property-management-admin-*.vercel.app`

### 2. Client Frontend (Vite/React)
**Repository**: `web` folder

**Steps**:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import the GitHub repository
4. Select the `web` folder as the root directory
5. Configure environment variables:
   - `VITE_SERVER_BASE_URL`: `https://property-management-system-0uoy.onrender.com`
   - All other environment variables from `.env` file
6. Click "Deploy"

**Expected URL**: `https://property-management-client-*.vercel.app`

## Environment Variables Needed

### Admin Frontend
```
NEXT_PUBLIC_SERVER_BASE_URL=https://property-management-system-0uoy.onrender.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=duog8eoel
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=preset
GEMINI_API_KEY=AIzaSyCgaGrHLiUp6x1BUhG6z0tMqQt86M7atQI
GOOGLE_GEMINI_API_KEY=AIzaSyCgaGrHLiUp6x1BUhG6z0tMqQt86M7atQI
CHAPA_PUBLIC_KEY=CHAPUBK_TEST-MLttcRAAQBGA6QzM9zLhDbVYrNiaSsiJ
CHAPA_SECRET_KEY=CHASECK_TEST-s3aSBrDwAZRhoB1NvwaWhdYUjqvRTZNt
CHAPA_ENCRYPTION_KEY=pwikShMIrO1qaNs8tJcyH1HD
CHAPA_API_URL=https://api.chapa.co/v1
CHAPA_WEBHOOK_SECRET=asjkdjkwasd29iajsdnmdcnsmzdnms
```

### Client Frontend
```
VITE_SERVER_BASE_URL=https://property-management-system-0uoy.onrender.com
```

## Post-Deployment Steps

1. **Update CORS**: The backend already allows Vercel URLs, but if needed, add the new URLs to the CORS patterns in `backend/src/app.ts`

2. **Test the Applications**:
   - Admin: Login and test adding highlights, nearby places, policies
   - Client: Verify data displays correctly

3. **Update Local Development**: 
   - Keep local `.env` files pointing to `localhost:3000` for local development
   - Only change to deployed URLs when testing production

## Build Commands Used

### Admin (Next.js)
- Build: `npm run build`
- Output: `.next` directory
- Framework: Next.js

### Client (Vite)
- Build: `npm run build`
- Output: `dist` directory
- Framework: Vite
