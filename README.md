# Identity Reconciliation Service

A production-ready Node.js backend system built to solve the identity reconciliation problem. It consolidates user contacts based on `email` and `phoneNumber`, dynamically creating secondary contacts or promoting primaries depending on the incoming queries.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)

## Setup & Running Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment variables**
   Create a `.env` file in the root directory (already included for local dev):
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/identity-reconciliation
   ```
   *(Ensure you have a MongoDB server running locally or update the URI to an Atlas instance).*

3. **Run in Development Mode**
   ```bash
   npm run dev
   ```

4. **Build and Start (Production Preview)**
   ```bash
   npm run build
   npm start
   ```

## API Documentation

### `POST /identify`

Reconciles an identity using the provided payload.

**Request Payload:**
```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```

**Successful Response (200 OK)**:
```json
{
  "contact": {
    "primaryContactId": "65b90f1...",
    "emails": ["mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

## Deployment Instructions (Render)

Deploying a Node.js + MongoDB stack to Render is simple:

1. **Prepare MongoDB**
   - Head over to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a free cluster.
   - Whitelist IP addresses (usually `0.0.0.0/0` for external cloud endpoints).
   - Get your MongoDB connection string (`mongodb+srv://...`).

2. **Deploy on Render (Web Service)**
   - Create a new **Web Service** on [Render](https://render.com/).
   - Connect your GitHub repository containing this code.
   - **Environment:** Node
   - **Build Command:**
     ```bash
     npm install && npm run build
     ```
   - **Start Command:**
     ```bash
     npm start
     ```
   - **Environment Variables:**
     Add `MONGO_URI` to point to your Atlas connection string. Add `PORT` (Render maps its own if omitted, but standard is `10000`).

3. **Deploy**
   - Click "Create Web Service".
   - Your `/identify` endpoint will be available at your `https://your-service.onrender.com/identify`.

## Code Architecture
- `src/controllers`: Handles HTTP req/res logic and data extraction.
- `src/services`: Contains the core reconciliation logic and DB interaction.
- `src/models`: Defines the Mongoose schemas.
- `src/routes`: Express router bindings.
- `src/config`: DB connection logic.
- `src/middlewares`: Global error catching to prevent server crashes.
