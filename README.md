# Sky Vault

Sky Vault is a full-stack MERN cloud storage web app inspired by Google Drive. It supports user authentication, image/video uploads to Cloudinary, file management, and a clean responsive interface built with React, Vite, and Tailwind CSS.

## Folder Structure

backend/
- `config/` - MongoDB and Cloudinary configuration
- `controllers/` - Auth and file controller logic
- `middleware/` - Auth and error handlers
- `models/` - Mongoose schemas for User and File
- `routes/` - Express API routes
- `utils/` - Multer upload helper
- `server.js` - Backend entry point
- `.env.example` - Backend environment variables example

frontend/
- `src/` - React application source
- `src/components/` - Reusable UI components
- `src/context/` - Authentication provider
- `src/pages/` - Page routes and views
- `src/utils/` - API helper
- `tailwind.config.js` - Tailwind setup
- `postcss.config.js` - PostCSS config
- `.env.example` - Frontend environment variables example

## Features

- User registration and login with JWT authentication
- Protected dashboard routes
- Password hashing with bcrypt
- File upload via Multer and Cloudinary
- File metadata stored in MongoDB
- Search, filter, rename, delete, download, and copy links
- Responsive modern UI with Tailwind CSS
- Toast notifications and loading states

## Backend Setup

1. Open a terminal in `backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill values:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## Frontend Setup

1. Open a terminal in `frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and set API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the app:
   ```bash
   npm run dev
   ```

## API Routes

### Auth
- `POST /api/auth/register` — register user
- `POST /api/auth/login` — login user

### Files
- `GET /api/files` — get current user files
- `GET /api/files/recent` — get user recent files
- `POST /api/files/upload` — upload file (multipart/form-data)
- `DELETE /api/files/:id` — delete file by ID
- `PUT /api/files/:id` — rename file by ID

## MongoDB Schemas

### User
- `name`
- `email`
- `password`

### File
- `userId`
- `fileName`
- `fileUrl`
- `publicId`
- `fileType`
- `fileSize`
- `createdAt`

## Tailwind Setup

Tailwind is configured in `frontend/tailwind.config.js` and imported in `frontend/src/index.css` using `@tailwind base`, `@tailwind components`, and `@tailwind utilities`.

## Deployment

### Vercel (Frontend)
1. Connect the `frontend` folder as a new Vercel project.
2. Set environment variable:
   - `VITE_API_URL` = `https://your-backend-url/api`
3. Build command: `npm run build`
4. Output directory: `dist`

### Render (Backend)
1. Create a new Web Service with the `backend` folder.
2. Set build command: `npm install`
3. Start command: `npm run start`
4. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `FRONTEND_URL`

## API Testing Example

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Upload File
```bash
curl -X POST http://localhost:5000/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

## Notes
- Ensure Cloudinary credentials are valid
- Use HTTPS in production
- Use strong JWT secret and secure storage
