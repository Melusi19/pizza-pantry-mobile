AI conversation link:
https://chatgpt.com/share/68fdeaaa-16fc-800e-bb69-df8688ffdef2
https://chatgpt.com/share/68fdeb81-9bbc-800e-ae0a-edba70ca0bff

🍕 Pizza Pantry Mobile

A mobile inventory management app for a pizza shop, built with React Native (Expo) and TypeScript.
The app allows authenticated users to manage pizza inventory by viewing items, adding new ones, editing quantities, and deleting entries — all through a smooth, touch-first interface.

🚀 Project Overview

Goal:
Complement the pizza shop’s workflow by allowing staff to manage inventory directly from their mobile devices.

Key Features:

🔐 User authentication (Sign In / Sign Up)

📦 Inventory list with search, filter, and pull-to-refresh

📝 Add/Edit items with strong validation

➕/➖ Adjust quantities with reason logging

🗑 Delete items

⚡ Polished UI with empty, loading, and error states

🧩 Tech Stack
Category	Choice	Reason
Framework	React Native
 (Expo)	Cross-platform development, easy setup, and fast iteration
Language	TypeScript	Type safety and maintainable codebase
Auth	Clerk (React Native SDK)	Modern, secure authentication with minimal setup
Backend	Express.js + MongoDB	Lightweight and flexible data persistence
Validation	Zod	Schema-based validation for forms and API requests
UI Library	React Native Paper / Native Base	Consistent, mobile-optimized UI components
Navigation	React Navigation (Stack + Bottom Tabs)	Intuitive and smooth mobile navigation
Testing (optional)	Jest + React Native Testing Library	Unit tests for core logic and UI components
📱 Screens Overview
Screen	Description
Sign In / Sign Up	User authentication flow
Inventory List	Displays all inventory items, includes search/filter and pull-to-refresh
Item Detail	Shows item information and recent quantity adjustments
Add/Edit Item	Form for creating or updating an item (with validation)
Adjust Quantity	Modal or screen for increasing/decreasing stock with reason
Loading / Empty / Error	Provides clear UI feedback for different states
🧠 Data Model
Item Schema (MongoDB)
{
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string; // e.g. "kg", "boxes"
  lastUpdated: Date;
  changeLog: [
    {
      date: Date;
      change: number;
      reason: string;
      userId: string;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

⚙️ Backend Setup (Express + MongoDB)

Directory: /server

Endpoints:

POST   /api/auth/register       // Register user
POST   /api/auth/login          // Login user
GET    /api/items               // Fetch all inventory items
POST   /api/items               // Add new item
PUT    /api/items/:id           // Edit existing item
PATCH  /api/items/:id/adjust    // Adjust item quantity
DELETE /api/items/:id           // Delete item


To run backend locally:

cd server
npm install
npm run dev


Ensure your .env file includes:

MONGO_URI=mongodb+srv://<your-cluster>
JWT_SECRET=your_jwt_secret
PORT=5000

📦 Frontend Setup (React Native + Expo)

Directory: /app

Installation:

cd app
npm install
npx expo start


Environment Variables (.env):

EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

🧪 Validation (Zod)

Used for form and request validation:

import { z } from "zod";

export const ItemSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().nonempty("Category required"),
  quantity: z.number().min(0),
  unit: z.string().nonempty(),
});

🌐 API Integration

Axios is used to handle API communication.

import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const getItems = async () => api.get("/items");
export const addItem = async (data) => api.post("/items", data);
export const adjustItem = async (id, data) => api.patch(`/items/${id}/adjust`, data);

✨ Optional Enhancements (Nice-to-Have)

Offline-first sync: Store changes locally using AsyncStorage and sync on reconnect.

PowerSync integration: For real-time local-first data sync.

Unit tests: For UI and logic using Jest + React Native Testing Library.

🧭 Navigation Flow
AuthStack
 ├── SignInScreen
 └── SignUpScreen

AppTabs
 ├── InventoryListScreen
 ├── AddItemScreen
 ├── ItemDetailScreen
 ├── AdjustQuantityModal

📸 UI/UX Highlights

Smooth animations and transitions

Mobile-friendly spacing and touch areas

Clear empty/loading/error feedback

Pull-to-refresh for data reload

Accessible color contrast and font sizing

💾 Offline Mode (optional)

If implemented:

Changes made offline are stored in AsyncStorage

Once reconnected, queued updates sync with the backend

🧰 Scripts
Command	Description
npm start	Run the app in Expo
npm run android	Run on Android emulator/device
npm run ios	Run on iOS simulator
npm run test	Run unit tests
npm run lint	Run linter checks
🧑‍💻 Developer Notes

The app uses Clerk for secure, modern authentication.

Strong form validation ensures data integrity before backend submission.

Clean architecture: separation of concerns (screens, components, services, models).

Built with scalability in mind (can easily extend to full restaurant management).
