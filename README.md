🍕 Pizza Pantry Mobile
A full-stack inventory management mobile application built for pizza restaurants and food service businesses. Manage your inventory, track stock levels, and streamline your operations with this beautiful, responsive React Native app.

https://img.shields.io/badge/Pizza-Pantry-orange https://img.shields.io/badge/React%2520Native-0.73-blue https://img.shields.io/badge/Next.js-14-black https://img.shields.io/badge/TypeScript-5.0-blue

📱 Features
Mobile App (Frontend)
🔐 Secure Authentication - Clerk integration with email/password and social login

📦 Inventory Management - Add, edit, delete, and view inventory items

📊 Stock Tracking - Real-time quantity tracking with low stock alerts

🔄 Quantity Adjustments - Record stock changes with reasons and history

🔍 Search & Filter - Find items quickly by name or category

📱 Mobile-Optimized UI - Beautiful, touch-friendly interface

⚡ Offline Support - Queue actions when offline, sync when reconnected

🎯 Type Safety - Full TypeScript implementation

Backend API
🚀 Next.js API Routes - High-performance serverless functions

🔒 Authentication - Clerk-protected endpoints

🗄️ MongoDB - Scalable database with proper indexing

📈 Real-time Updates - Instant inventory synchronization

🛡️ Input Validation - Zod schema validation

📝 Audit Logging - Complete adjustment history

🌐 CORS Enabled - Ready for mobile app integration

1. Frontend Setup

# Clone the repository
git clone <repository-url>
cd pizza-pantry-mobile

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

2. Backend Setup

# Navigate to backend
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

3. Database Setup
Option A: Local MongoDB

# Install MongoDB locally
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

Option B: MongoDB Atlas

Create account at MongoDB Atlas

Create a cluster and database

Get connection string and update MONGODB_URI

4. Clerk Setup
Create account at Clerk

Create new application

Configure social providers (optional)

Copy keys to both frontend and backend environment files
