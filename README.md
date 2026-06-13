# Digital Udhaar Khata

A full-stack bookkeeping and credit ledger application for local retailers, shopkeepers, and customers.

## Project Structure

- `backend/` - Node.js + Express API
- `frontend/` - React + Vite SPA

## Backend

### Tech stack

- Node.js
- Express
- MongoDB / Mongoose
- JWT authentication
- bcryptjs
- dotenv
- CORS
- express-rate-limit
- Morgan

### Available scripts

```bash
cd backend
npm install
npm run dev
```

Or to start without nodemon:

```bash
npm start
```

### Environment variables

Create a `.env` file in `backend/` with values similar to:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/digital-udhaar-khata
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

### API routes

- `POST /api/auth/register` - register a new shopkeeper
- `POST /api/auth/login` - login
- `GET /api/auth/profile` - fetch current profile (authenticated)
- `PUT /api/auth/profile` - update current profile (authenticated)
- `GET /api/users` - admin user management
- `GET /api/customers` - shopkeeper customer list
- `POST /api/transactions` - create transaction
- `GET /api/notifications` - fetch notifications
- `GET /api/settings` - application settings

> The backend uses `backend/routes/*.js` and `backend/controllers/*.js` for routing and controller logic.

## Frontend

### Tech stack

- React 19
- Vite
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React icons
- Recharts

### Available scripts

```bash
cd frontend
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

### Frontend configuration

The frontend expects the API base URL in `VITE_API_BASE_URL`. Configure it in a `.env` file inside `frontend/` if needed:

```env
VITE_API_BASE_URL=http://localhost:5000
```

If not configured, it defaults to `http://localhost:5000`.

## Running the app

1. Start the backend:
   - `cd backend`
   - `npm install`
   - `npm run dev`

2. Start the frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

3. Open the Vite app URL shown in the terminal (typically `http://localhost:5173`).

## Notes

- Authentication state is stored in `localStorage`.
- The backend uses JWT tokens for protected routes.
- The frontend includes dashboard routes for `shopkeeper` and `admin` roles.
- Profile updates are sent to `/api/auth/profile` with authorization headers.

## Troubleshooting

- If the homepage fails to render, check `frontend/src/pages/Home.jsx` for component initialization issues.
- If login or profile updates fail, verify that the backend is running and the JWT token is being attached by Axios in `frontend/src/utils/api.js`.

## Want to improve

- Add better error handling for auth failures
- Add unit/integration tests
- Add a root-level script to run both backend and frontend together
