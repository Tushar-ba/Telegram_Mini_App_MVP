A Node.js/Express backend for a Telegram Mini App with user authentication, gold coin management, and AFK mining features.

---

## 🌐 Base URL

```
https://wgxcjz8x-3000.inc1.devtunnels.ms

```

---

## 📮 API Routes for Postman Testing

### 🔐 1. Authentication Route

**Login or Register a User Based on Telegram `userId`**

- **Endpoint:**
    
    `POST https://wgxcjz8x-3000.inc1.devtunnels.ms/api/auth/login`
    
- **Headers:**
    
    ```json
    {
      "Content-Type": "application/json"
    }
    
    ```
    
- **Body:**
    
    ```json
    {
      "userId": "123456789",
      "walletAddress": "0x1234567890abcdef"
    }
    
    ```
    
- ✅ **Success Response:**
    
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "token": "JWT_TOKEN_HERE",
        "user": {
          "userId": "123456789",
          "walletAddress": "0x1234567890abcdef",
          "goldCoins": 1000,
          "stars": 5,
          "apraTokens": 100,
          "level": 1,
          "energy": 100
        }
      }
    }
    
    ```
    
- ❌ **Error Response:**
    
    ```json
    {
      "success": false,
      "message": "User ID is required"
    }
    
    ```
    

---

### 👤 2. User Data Routes

### 📘 A. Get User Data

- **Endpoint:**
    
    `GET https://wgxcjz8x-3000.inc1.devtunnels.ms/api/userdata/123456789`
    
- **Headers:**
    
    ```json
    {
      "Content-Type": "application/json"
    }
    
    ```
    
- ✅ **Success Response:**
    
    ```json
    {
      "success": true,
      "user": {
        "userId": "123456789",
        "walletAddress": "0x1234567890abcdef",
        "goldCoins": 1000,
        "stars": 5,
        "apraTokens": 100,
        "level": 1,
        "energy": 100,
        "tapAmount": 10,
        "miningRate": 5,
        "afkMiningActive": true,
        "lastLogin": "2024-01-15T10:30:00.000Z",
        "signupTime": "2024-01-10T08:00:00.000Z"
      }
    }
    
    ```
    
- ❌ **Error Response:**
    
    ```json
    {
      "success": false,
      "message": "User not found"
    }
    
    ```
    

---

```json
{ "error": "User not found" }
{ "error": "AFK mining is disabled" }
{ "error": "Cannot claim: last login more than 3 hours ago" }
{ "error": "No AFK earnings to claim" }

```

---

## 🔑 Authentication

Add this header for protected routes:

```
Authorization: Bearer YOUR_JWT_TOKEN

```

---

## ⚙️ Environment Variables

Your `.env` file must include:

```
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
PORT=3000
MONGODB_URI=mongodb://localhost:27017/yourdbname

```

---

## 🧪 Postman Collection Setup

### 🌐 1. Environment Variables

- `base_url` = `https://wgxcjz8x-3000.inc1.devtunnels.ms`
- `auth_token` = Set after login

### 🔁 2. Login Flow

- Call `POST /api/auth/login`
- Copy `token` from response
- Save it as `auth_token` in Postman environment

### 🔐 3. Authenticated Requests

Use:

```json
{
  "Authorization": "Bearer {{auth_token}}"
}

```

---

## 🚦 Error Handling Codes

| Code | Description |
| --- | --- |
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🧭 Suggested Testing Flow

1. 🔓 **Login/Register:**
    
    `POST {{base_url}}/api/auth/login`
    
2. 📊 **Fetch User Data:**
    
    `GET {{base_url}}/api/userdata/:userId`
    

---