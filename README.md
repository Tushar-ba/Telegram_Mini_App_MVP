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

### 🎁 3. Daily Rewards Routes

### 📘 A. Get Daily Rewards Status

- **Endpoint:**
    
    `GET https://wgxcjz8x-3000.inc1.devtunnels.ms/api/dailyRewards/123456789`
    
- **Headers:**
    
    ```json
    {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_JWT_TOKEN"
    }
    
    ```
    
- ✅ **Success Response:**
    
    ```json
    {
      "success": true,
      "data": {
        "dailyRewards": [
          {
            "rewardId": "day1",
            "day": 1,
            "reward": { "type": "goldCoins", "amount": 1000 },
            "claimed": true,
            "claimedAt": "2024-01-15T10:30:00.000Z"
          },
          {
            "rewardId": "day2",
            "day": 2,
            "reward": { "type": "goldCoins", "amount": 2000 },
            "claimed": false
          }
        ],
        "claimableDays": [2, 3],
        "currentStreak": 1,
        "daysSinceLastLogin": 2,
        "allClaimed": false,
        "nextResetTime": null
      }
    }
    
    ```
    

### 📘 B. Claim Daily Reward

- **Endpoint:**
    
    `POST https://wgxcjz8x-3000.inc1.devtunnels.ms/api/dailyRewards/claim`
    
- **Headers:**
    
    ```json
    {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_JWT_TOKEN"
    }
    
    ```
    
- **Body:**
    
    ```json
    {
      "userId": "123456789",
      "day": 2
    }
    
    ```
    
- ✅ **Success Response:**
    
    ```json
    {
      "success": true,
      "message": "Successfully claimed Day 2 reward: 2000 goldCoins!",
      "data": {
        "claimedReward": {
          "day": 2,
          "type": "goldCoins",
          "amount": 2000
        },
        "updatedBalance": {
          "goldCoins": 12000,
          "stars": 107
        },
        "currentStreak": 2,
        "allClaimed": false
      }
    }
    
    ```
    
- ❌ **Error Responses:**
    
    ```json
    {
      "success": false,
      "message": "This reward has already been claimed"
    }
    
    ```
    
    ```json
    {
      "success": false,
      "message": "Cannot claim future rewards. You can only claim rewards for days since your last login."
    }
    
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
    
3. 🎁 **Get Daily Rewards:**
    
    `GET {{base_url}}/api/dailyRewards/:userId`
    
4. 🏆 **Claim Daily Reward:**
    
    `POST {{base_url}}/api/dailyRewards/claim`
    

---