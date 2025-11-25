# Backend API - Component Tracking System

REST API for automatic component tracking system with JWT authentication and data export.

## 🚀 Technologies

- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication and authorization
- **bcryptjs** - Password encryption
- **express-validator** - Data validation
- **csv-writer** - CSV export
- **helmet** + **cors** - Security
- **morgan** - Request logging

## 📋 Requirements

- Node.js >= 18.0.0
- MongoDB Atlas (or local instance)
- npm or yarn

## ⚙️ Installation

1. **Clone repository and go to backend directory:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

```bash
cp env.example .env
```

Edit `.env` with your configurations:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/t1_technical_test?retryWrites=true&w=majority
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

4. **Start the server:**

```bash
# Development
npm run dev

# Production
npm start
```

## 📚 API Endpoints

### 🔐 Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Successful response (201):**

```json
{
  "status": "success",
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2023-09-06T10:30:00.000Z"
    }
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Successful response (200):**

```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user",
      "lastLogin": "2023-09-06T10:35:00.000Z"
    }
  }
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Get Profile

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### 📊 Component Tracking

#### Register Interaction (Protected)

```http
POST /api/components/track
Content-Type: application/json

{
  "componentName": "Button",
  "variant": "primary",
  "action": "click",
  "sessionId": "sess_123456789",
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "screenResolution": {
      "width": 1920,
      "height": 1080
    },
    "viewport": {
      "width": 1200,
      "height": 800
    },
    "url": "https://example.com/dashboard",
    "referrer": "https://google.com",
    "customData": {
      "buttonText": "Guardar",
      "formId": "user-form"
    }
  },
  "performance": {
    "loadTime": 150,
    "renderTime": 25,
    "interactionTime": 5
  },
  "location": {
    "country": "Mexico",
    "region": "CDMX",
    "city": "Ciudad de México",
    "timezone": "America/Mexico_City"
  }
}
```

**Successful response (201):**

```json
{
  "status": "success",
  "message": "Interaction registered successfully",
  "data": {
    "tracking": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "componentName": "Button",
      "variant": "primary",
      "action": "click",
      "timestamp": "2023-09-06T10:40:00.000Z"
    }
  }
}
```

#### Get Statistics (Protected)

```http
GET /api/components/stats?startDate=2023-09-01&endDate=2023-09-06&componentName=Button&limit=50&page=1
```

**Query parameters:**

- `startDate` (optional): Start date (ISO8601)
- `endDate` (optional): End date (ISO8601)
- `componentName` (optional): Filter by component
- `variant` (optional): Filter by variant
- `action` (optional): Filter by action
- `limit` (optional): Number of results (1-1000, default: 100)
- `page` (optional): Results page (default: 1)

**Successful response (200):**

```json
{
  "status": "success",
  "data": {
    "summary": {
      "totalInteractions": 1250,
      "totalPages": 25,
      "currentPage": 1,
      "resultsPerPage": 50
    },
    "basicStats": [
      {
        "componentName": "Button",
        "totalInteractions": 450,
        "variants": [
          {
            "variant": "primary",
            "interactions": 300,
            "actions": [
              { "action": "click", "count": 280 },
              { "action": "hover", "count": 20 }
            ],
            "lastUsed": "2023-09-06T10:40:00.000Z",
            "firstUsed": "2023-09-01T08:00:00.000Z"
          }
        ]
      }
    ],
    "dailyStats": [
      {
        "period": { "year": 2023, "month": 9, "day": 6 },
        "count": 85,
        "uniqueComponentsCount": 12,
        "uniqueVariantsCount": 18
      }
    ],
    "topComponents": [
      {
        "_id": "Button",
        "count": 450,
        "lastUsed": "2023-09-06T10:40:00.000Z"
      }
    ],
    "topActions": [
      { "_id": "click", "count": 800 },
      { "_id": "hover", "count": 300 }
    ],
    "recentInteractions": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "componentName": "Button",
        "variant": "primary",
        "action": "click",
        "timestamp": "2023-09-06T10:40:00.000Z",
        "sessionId": "sess_123456789"
      }
    ]
  }
}
```

#### Real-time Statistics (Protected)

```http
GET /api/components/stats/realtime
```

**Successful response (200):**

```json
{
  "status": "success",
  "data": {
    "realTime": {
      "lastHour": {
        "totalInteractions": 45,
        "uniqueComponents": 8,
        "uniqueSessions": 12
      },
      "lastDay": {
        "totalInteractions": 850,
        "uniqueComponents": 15,
        "uniqueSessions": 120
      },
      "minutelyActivity": [
        {
          "_id": {
            "year": 2023,
            "month": 9,
            "day": 6,
            "hour": 10,
            "minute": 40
          },
          "count": 5
        }
      ]
    },
    "timestamp": "2023-09-06T10:45:00.000Z"
  }
}
```

#### Component Details (Protected)

```http
GET /api/components/Button/details?startDate=2023-09-01&endDate=2023-09-06
```

#### Export Data (Authenticated)

```http
GET /api/components/export?format=csv&startDate=2023-09-01&endDate=2023-09-06&componentName=Button
Authorization: Bearer <token>
```

**Query parameters:**

- `format` (optional): `csv` or `json` (default: csv)
- `startDate` (optional): Start date
- `endDate` (optional): End date
- `componentName` (optional): Filter by component
- `variant` (optional): Filter by variant
- `action` (optional): Filter by action

**Response:** Downloadable file (CSV or JSON)

### 🏥 Health Check

#### Check Server Status

```http
GET /api/health
```

**Successful response (200):**

```json
{
  "status": "OK",
  "timestamp": "2023-09-06T10:45:00.000Z",
  "uptime": 3600.5,
  "environment": "development"
}
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. For protected endpoints, include the token in the header:

```http
Authorization: Bearer <tu_jwt_token>
```

### Public Endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/health`

### Protected Endpoints:

- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PATCH /api/auth/profile`
- `PATCH /api/auth/change-password`
- `POST /api/components/track`
- `GET /api/components/stats`
- `GET /api/components/stats/realtime`
- `GET /api/components/:componentName/details`
- `GET /api/components/export`

## 📝 Data Model

### User

```javascript
{
  _id: ObjectId,
  email: String, // unique, required
  password: String, // hashed, required
  name: String, // required
  role: String, // 'user' | 'admin'
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Component Tracking

```javascript
{
  _id: ObjectId,
  componentName: String, // required
  variant: String, // required
  action: String, // 'click' | 'hover' | 'focus' | etc.
  timestamp: Date,
  sessionId: String,
  userId: ObjectId, // reference to User (optional)
  metadata: {
    userAgent: String,
    screenResolution: { width: Number, height: Number },
    viewport: { width: Number, height: Number },
    url: String,
    referrer: String,
    customData: Mixed
  },
  performance: {
    loadTime: Number,
    renderTime: Number,
    interactionTime: Number
  },
  location: {
    country: String,
    region: String,
    city: String,
    timezone: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## ⚠️ Error Codes

- **400** - Bad Request (invalid data)
- **401** - Unauthorized (invalid/expired token)
- **403** - Forbidden (no permissions)
- **404** - Not Found (resource not found)
- **409** - Conflict (duplicate email)
- **429** - Too Many Requests (rate limit exceeded)
- **500** - Internal Server Error

### Error Format

```json
{
  "status": "fail",
  "message": "Error description",
  "validationErrors": [
    {
      "field": "email",
      "message": "Must be a valid email",
      "value": "invalid-email"
    }
  ]
}
```

## 🔧 Development Configuration

### Required Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=secret_muy_seguro
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000
```

### Available Scripts

```bash
npm start          # Start in production
npm run dev        # Start in development with nodemon
npm test           # Run tests
```

### Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Affected endpoints:** All

### Logging

- Logs are saved in `logs/app.log` and `logs/error.log`
- Format: `[timestamp] LEVEL: message | Meta: {...}`

## 🚀 Deployment

1. **Configure production environment variables**
2. **Configure MongoDB Atlas**
3. **Configure CORS for your domain**
4. **Use HTTPS in production**
5. **Configure appropriate rate limiting**

## 📊 Monitoring

- **Health check:** `GET /api/health`
- **Logs:** Files in `logs/` directory
- **Metrics:** Real-time statistics available

## 📄 License

MIT License - see LICENSE file for details.
