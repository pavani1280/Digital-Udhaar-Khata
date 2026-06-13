#  Digital Udhaar Khata

A full-stack bookkeeping and credit ledger application designed for local retailers, shopkeepers, and customers. It helps businesses digitally manage **Udhaar (Credit)** and **Jama (Payments)** with secure authentication, cloud-based records, and an intuitive dashboard.

---

##  Features

*  Digital Udhaar (Credit) & Jama (Payment) Ledger
*  Customer Management
*  JWT-based Authentication & Authorization
*  Shopkeeper and Admin Dashboards
*  Automatic Balance Calculation
*  WhatsApp Payment Reminder Support
*  PDF Ledger Statement Generation
*  Multi-device Cloud Sync
*  Profile & Settings Management
*  Credit Limit Tracking
*  Notifications System

---

##  Project Structure

```text
Digital-Udhaar-Khata/
│
├── backend/      # Node.js + Express REST API
└── frontend/     # React + Vite Single Page Application
```

---

#  Backend

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* dotenv
* CORS
* express-rate-limit
* Morgan

## Installation

```bash
cd backend
npm install
npm run dev
```

To run without Nodemon:

```bash
npm start
```

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/digital-udhaar-khata
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

## API Routes

| Method | Endpoint             | Description                         |
| ------ | -------------------- | ----------------------------------- |
| POST   | `/api/auth/register` | Register a new shopkeeper           |
| POST   | `/api/auth/login`    | Login user                          |
| GET    | `/api/auth/profile`  | Fetch authenticated user profile    |
| PUT    | `/api/auth/profile`  | Update authenticated user profile   |
| GET    | `/api/users`         | Admin user management               |
| GET    | `/api/customers`     | Retrieve customer list              |
| POST   | `/api/transactions`  | Create a credit/payment transaction |
| GET    | `/api/notifications` | Fetch notifications                 |
| GET    | `/api/settings`      | Retrieve application settings       |

The backend follows a modular architecture using:

* `backend/routes/`
* `backend/controllers/`
* `backend/models/`
* `backend/middleware/`

---

# Frontend

## Tech Stack

* React 19
* Vite
* Redux Toolkit
* React Router DOM
* Axios
* Tailwind CSS
* Lucide React
* Recharts

## Installation

```bash
cd frontend
npm install
npm run dev
```

For production build:

```bash
npm run build
```

## Frontend Environment Variables

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

If not specified, the frontend defaults to:

```text
http://localhost:5000
```

---

# Running the Application

### Start Backend

```bash
cd backend
npm install
npm run dev
```

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open the Vite development server (typically):

```text
http://localhost:5173
```

---

# Authentication

* JWT-based authentication
* Protected API routes
* Authorization headers for secured endpoints
* User session persistence using `localStorage`

---

# Notes

* Authentication state is stored in `localStorage`.
* Shopkeeper and Admin dashboards are role-based.
* Profile updates are sent to `/api/auth/profile` with valid authorization headers.
* Axios is configured to communicate with the backend API.

---

### Login or profile

Verify:

* Backend server is running.
* MongoDB connection is active.
* JWT token is correctly attached by Axios in:

```text
frontend/src/utils/api.js
```

* `VITE_API_BASE_URL` points to the correct backend URL.

---

# Future Improvements

* Enhanced authentication error handling
* Unit and integration testing
* Root-level script to run backend and frontend simultaneously
* SMS and Email notifications
* Advanced analytics dashboard
* Mobile application support
* Multi-language support
* Automated payment reminder scheduling

---

##  About

**Digital Udhaar Khata** modernizes traditional paper-based credit books by providing a secure, scalable, and user-friendly platform for managing customer dues, payments, and business records efficiently.
