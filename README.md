✅ Event Booking Platform – Features & Tech Stack
🔹 Frontend (React + Redux + TypeScript)

Authentication Pages

Login Page

Sign-up Page

Event Management (Admin only)

Create Event

Update Event

Delete Event

Event listing with details (title, date, location, tickets, price, etc.)

Bookings (User)

Book tickets for events

Cancel booking (with real-time updates using WebSocket)

State Management (Redux Toolkit)

authSlice → Handles login/logout & authentication state

themeSlice → Dark/Light theme toggling

bookingSlice → Manage bookings state (add, cancel, update in real-time)

UI & Components

Used Shadcn UI for buttons, modals, forms, cards, etc.

Used lucide-react & react-icons for icons

Responsive Navbar with Logout functionality

Other Frontend Features

Form validation

Toast notifications (success/error)

Loading states with spinners

🔹 Backend (Express + Mongoose + Node.js)

Database (MongoDB + Mongoose)

Models: User, Event, Booking

Authentication & Authorization

JWT for login & signup authentication

bcryptjs for password hashing

Middleware to protect routes (user & admin)

Event Management (CRUD APIs)

Create Event (Admin only)

Update Event (Admin only)

Delete Event (Admin only)

Get all events / single event

Booking Management

Book event tickets

Cancel booking (update status → cancelled)

Confirm booking (admin side, reduces available tickets)

Real-time updates via WebSocket (Socket.io)

Notify users & admins on booking create/update/cancel

File Uploads

Multer for handling uploads

DataURI for converting files

Cloudinary for storing & managing images (event thumbnails, etc.)

Testing APIs

Used Postman for testing endpoints

🔹 Tools & Libraries

Frontend: React, Redux Toolkit, Shadcn, Lucide-react, React-icons

Backend: Express, Mongoose, JWT, bcryptjs, Socket.io, Multer, Cloudinary, DataURI

Testing: Postman

Database: MongoDB
