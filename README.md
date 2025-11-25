![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Complete-brightgreen?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)

# T1 Technical Test - Component Tracking System

A full-stack application for tracking component interactions with real-time analytics, built with Node.js, Express, MongoDB, Next.js, and TypeScript.

## 🚀 Features

- **Styled guide components with Tailwind CSS**
- **Component Tracking**: Track user interactions with UI components
- **Real-time Analytics**: Live statistics and performance metrics
- **Data Export**: Export tracking data in CSV and JSON formats
- **Public API**: Open endpoints for tracking and statistics
- **Authentication**: Secure user management system
- **Responsive Design**: Modern UI with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

### Backend

- **[Node.js](https://nodejs.org/)** (v18+) - JavaScript runtime
- **[Express.js](https://expressjs.com/)** (v4.18.2) - Web framework
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** (v8.0.3) - MongoDB ODM
- **[JWT](https://jwt.io/)** (v9.0.2) - JSON Web Tokens for authentication
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** (v2.4.3) - Password hashing library
- **[Express Validator](https://express-validator.github.io/)** (v7.0.1) - Data validation library
- **[Helmet](https://helmetjs.github.io/)** (v7.1.0) - Security middleware
- **[CORS](https://www.npmjs.com/package/cors)** (v2.8.5) - Cross-Origin Resource Sharing
- **[Morgan](https://www.npmjs.com/package/morgan)** (v1.10.0) - HTTP request logger

### Frontend

- **[Node.js](https://nodejs.org/)** (v18+) - JavaScript runtime
- **[Next.js](https://nextjs.org/)** (v16.0.3) - React framework
- **[React](https://reactjs.org/)** (v19.2.0) - UI library
- **[TypeScript](https://www.typescriptlang.org/)** (v5) - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** (v4) - Utility-first CSS framework
- **[Formik](https://formik.org/)** (v2.4.9) - Form management library
- **[Yup](https://github.com/jquense/yup)** (v1.7.1) - Schema validation library
- **[Chart.js](https://www.chartjs.org/)** (v4.5.1) - Data visualization library
- **[React Chart.js 2](https://react-chartjs-2.js.org/)** (v5.3.1) - React wrapper for Chart.js
- **[Heroicons](https://heroicons.com/)** (v2.2.0) - Beautiful hand-crafted SVG icons

### Development Tools

- **[Jest](https://jestjs.io/)** (v29.7.0) - Testing framework
- **[ESLint](https://eslint.org/)** (v9) - Code linting
- **[Prettier](https://prettier.io/)** (v3.6.2) - Code formatting
- **[Husky](https://typicode.github.io/husky/)** (v9.1.7) - Git hooks
- **[Concurrently](https://www.npmjs.com/package/concurrently)** (v8.2.0) - Run multiple commands
- **[Nodemon](https://nodemon.io/)** (v3.0.2) - Development server auto-restart

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (v5.0 or higher)
- **Git**

## 🔧 Installation

### Option 1: Full Project Setup (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd t1-tecnhical-test
   ```

2. **Install dependencies for both frontend and backend**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env` files in both backend and frontend directories:

   **Backend** (`backend/.env`):

   ```env
   NODE_ENV=development
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/t1-tracking
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3000
   ```

   **Frontend** (`frontend/.env.local`):

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

4. **Start the development servers**

   ```bash
   npm run dev
   ```

   This will start both backend (port 5001) and frontend (port 3000) concurrently.

### Option 2: Backend Only

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables** (see backend `.env` above)

3. **Start the backend server**
   ```bash
   npm run dev:back
   ```

### Option 3: Frontend Only

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables** (see frontend `.env.local` above)

3. **Start the frontend server**
   ```bash
   npm run dev:front
   ```

## 📜 Available Scripts

### Root Level Scripts

- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:back` - Start backend in development mode with nodemon
- `npm run dev:front` - Start frontend development server
- `npm run build` - Build both applications for production
- `npm run build:back` - Build backend for production
- `npm run build:front` - Build frontend for production
- `npm install` - Install dependencies for both backend and frontend

### Backend Scripts (`cd backend`)

- `npm run dev` - Start backend in development mode with nodemon
- `npm run test` - Run backend tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run create-admin` - Create admin user

### Frontend Scripts (`cd frontend`)

- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🌐 API Endpoints

### Public Endpoints (No Authentication Required)

#### Component Tracking

- `POST /api/components/track` - Track component interaction
- `GET /api/components/stats` - Get tracking statistics
- `GET /api/components/stats/realtime` - Get real-time statistics

#### Health Check

- `GET /api/health` - Server health status

### Protected Endpoints (Authentication Required)

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile (Feature not implemented)
- `PUT /api/auth/profile` - Update user profile (Feature not implemented)

#### Data Export

- `GET /api/components/export` - Export tracking data (CSV/JSON)
- `GET /api/components/:componentName/details` - Get component details

## 📮 Postman Collection

Download the complete Postman collection to test all API endpoints:

**[📥 Download Postman Collection](./backend/postman-collection.json)**

### How to use:

1. Download the `postman-collection.json` file
2. Import it into Postman
3. Set the `baseUrl` variable to `http://localhost:5001`
4. For protected endpoints, first login and the token will be automatically set

## 🧪 Running Tests

### Backend and Frontend

```bash
npm run test
```

### Only Backend Tests

```bash
npm run test:back
```

### Only Frontend Tests

```bash
npm run test:front
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

## 🔐 Environment Variables

### Backend Environment Variables

| Variable         | Description               | Default                                 | Required |
| ---------------- | ------------------------- | --------------------------------------- | -------- |
| `NODE_ENV`       | Environment mode          | `development`                           | No       |
| `PORT`           | Server port               | `5001`                                  | No       |
| `MONGODB_URI`    | MongoDB connection string | `mongodb://localhost:27017/t1-tracking` | Yes      |
| `JWT_SECRET`     | JWT signing secret        | -                                       | Yes      |
| `JWT_EXPIRES_IN` | JWT expiration time       | `7d`                                    | No       |
| `CORS_ORIGIN`    | Allowed CORS origin       | `http://localhost:3000`                 | No       |

### Frontend Environment Variables

| Variable              | Description     | Default                     | Required |
| --------------------- | --------------- | --------------------------- | -------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5001/api` | Yes      |

## 🚀 Deployment

### Backend Deployment

1. Set production environment variables
2. Build the application: `npm run build`
3. Start the server: `npm start`

### Frontend Deployment

1. Set production environment variables
2. Build the application: `npm run build`
3. Start the server: `npm start`

## 📊 Usage Examples

### Track a Component Interaction

```javascript
// Public endpoint - no authentication required
fetch('http://localhost:5001/api/components/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    componentName: 'Button',
    variant: 'primary',
    action: 'click',
    sessionId: 'session-123',
    metadata: {
      url: 'https://example.com/dashboard',
      userAgent: 'Mozilla/5.0...',
    },
  }),
});
```

### Get Statistics

```javascript
// Public endpoint - no authentication required
fetch('http://localhost:5001/api/components/stats')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🔧 Code Quality & Git Hooks

This project uses several tools to maintain code quality and consistency:

### Husky & Pre-commit Hooks

The project is configured with **[Husky](https://typicode.github.io/husky/)** to run automated checks before each commit:

#### What happens on `git commit`:

1. **Lint-staged** runs on staged files
2. **Prettier** formats code automatically
3. **ESLint** checks for code quality issues
4. Commit is **blocked** if any check fails

#### Supported file types:

- JavaScript/TypeScript (`.js`, `.jsx`, `.ts`, `.tsx`)
- JSON files (`.json`)
- CSS files (`.css`)
- Markdown files (`.md`)

### Prettier Configuration

**[Prettier](https://prettier.io/)** ensures consistent code formatting across the entire project:

#### Available commands:

```bash
# Format all files
npm run format

# Check if files are properly formatted
npm run format:check
```

#### Auto-formatting on commit:

Files are automatically formatted when you commit thanks to the pre-commit hook configuration in `package.json`:

```json
"lint-staged": {
  "**/*.{js,jsx,ts,tsx,json,css,md}": [
    "prettier --write"
  ]
}
```

### ESLint Configuration

**[ESLint](https://eslint.org/)** helps catch potential bugs and enforces coding standards:

#### Backend linting:

```bash
cd backend
npm run lint
```

#### Frontend linting:

```bash
cd frontend
npm run lint
```

### Setup Instructions

If you're setting up the project for the first time:

1. **Install dependencies** (this will set up Husky automatically):

   ```bash
   npm install
   ```

2. **Husky will be configured** automatically via the `prepare` script

3. **Test the setup** by making a commit:
   ```bash
   git add .
   git commit -m "test: verify husky setup"
   ```

### Benefits

- **🎯 Consistent formatting** across all files
- **🐛 Catch errors** before they reach the repository
- **👥 Team collaboration** with unified code style
- **🚀 Automated workflow** - no manual formatting needed
- **📝 Clean git history** with properly formatted code

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

### Project Owner & Lead Developer

- **Jonathan Ramirez** - _Owner & Full Stack Developer_ - [@JonathanRamirezJ](https://github.com/JonathanRamirezJ)

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section
2. Create a new issue with detailed information
3. Contact the project owner

## 📈 Project Status

- ✅ **Backend API** - Complete
- ✅ **Frontend Dashboard** - Complete
- ✅ **Authentication System** - Complete
- ✅ **Component Tracking** - Complete
- ✅ **Real-time Analytics** - Complete
- ✅ **Data Export** - Complete
- ✅ **Public API Endpoints** - Complete
- ✅ **Postman Collection** - Complete
- ✅ **Documentation** - Complete

---

**Built with ❤️ by Jonathan Ramirez**
