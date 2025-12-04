# 🤖 MIRA AI Backend Repository

A powerful, real-time AI chat backend built with Node.js, featuring Google Gemini AI integration, vector-based memory management, and WebSocket support for seamless conversational experiences.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [What You Can Do](#what-you-can-do)
- [Technologies Used in Detail](#technologies-used-in-detail)

---

## 🎯 Overview

This backend repository provides a complete solution for building an AI-powered chat application. It integrates Google Gemini AI (Gemini 2.0 Flash) for intelligent responses, uses Pinecone vector database for long-term memory management, and implements real-time communication via Socket.io. The system supports user authentication, chat management, and context-aware conversations with both short-term and long-term memory capabilities.

---

## 🛠️ Tech Stack

### Core Technologies

- **Node.js** - JavaScript runtime environment
- **Express.js** (v5.1.0) - Web application framework
- **MongoDB** with **Mongoose** (v9.0.0) - Database and ODM
- **Socket.io** (v4.8.1) - Real-time bidirectional communication

### AI & ML

- **Google Gemini AI** (@google/genai v1.30.0) - AI model for generating responses
  - Model: `gemini-2.0-flash` for chat responses
  - Model: `gemini-embedding-001` for vector embeddings
- **Pinecone** (@pinecone-database/pinecone v6.1.3) - Vector database for semantic search and memory

### Security & Authentication

- **JWT** (jsonwebtoken v9.0.2) - Token-based authentication
- **bcrypt** (v6.0.0) - Password hashing
- **cookie-parser** (v1.4.7) - Cookie management

### Utilities

- **dotenv** (v17.2.3) - Environment variable management
- **nodemon** (v3.1.11) - Development server with auto-reload

---

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- 💬 **Real-time Chat** - WebSocket-based instant messaging
- 🤖 **AI-Powered Responses** - Google Gemini AI integration for intelligent conversations
- 🧠 **Memory Management** - Vector-based short-term (STM) and long-term (LTM) memory
- 📝 **Chat History** - Persistent chat storage with MongoDB
- 🔍 **Semantic Search** - Pinecone vector database for context retrieval
- ⚡ **Optimized Performance** - Parallel processing for faster response times
- 🎨 **HTML Support** - AI responses support HTML formatting

---

## 📦 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **Google Gemini API Key** - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Pinecone API Key** - Get from [Pinecone](https://www.pinecone.io/)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/majidsaddiqye/ChatGPT-BackendRepo.git
cd ChatGPT-BackendRepo
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all the required packages listed in `package.json`.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/chatgpt-db
# OR for MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/chatgpt-db

# JWT Secret Key (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini API Key
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key_here

# Pinecone API Key
PINECON_API_KEY=your_pinecone_api_key_here
```

### How to Get API Keys:

1. **Google Gemini API Key:**

   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy and paste it in `.env`

2. **Pinecone API Key:**

   - Visit [Pinecone](https://www.pinecone.io/)
   - Sign up for a free account
   - Go to API Keys section
   - Create a new API key
   - Copy and paste it in `.env`

3. **JWT Secret:**
   - Generate a random string (minimum 32 characters)
   - You can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## ▶️ Running the Project

### Development Mode (with auto-reload)

```bash
npm start
```

This uses `nodemon` to automatically restart the server when you make changes.

### Production Mode

```bash
node server.js
```

### Expected Output

When the server starts successfully, you should see:

```
Connected TO DB
Server is Listening on port 5000
```

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "password": "securePassword123"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** Returns JWT token in HTTP-only cookie

### Chat Routes (`/api/chat`)

#### Create Chat

```http
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My New Chat"
}
```

### WebSocket Events

#### Connect to Socket

```javascript
const socket = io("http://localhost:5000", {
  withCredentials: true,
  extraHeaders: {
    cookie: "token=your_jwt_token_here",
  },
});
```

#### Send Message to AI

```javascript
socket.emit("ai-message", {
  chat: "chat_id_here",
  content: "Your message here",
});
```

#### Receive AI Response

```javascript
socket.on("ai-response", (data) => {
  console.log("AI Response:", data.content);
  console.log("Chat ID:", data.chat);
});
```

---

## 📁 Project Structure

```
ChatGPT-BackendRepo/
│
├── src/
│   ├── app.js                 # Express app configuration
│   │
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   └── chat.controller.js    # Chat management logic
│   │
│   ├── db/
│   │   └── db.js              # MongoDB connection
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js    # JWT authentication middleware
│   │
│   ├── models/
│   │   ├── user.model.js      # User schema
│   │   ├── chat.model.js      # Chat schema
│   │   └── message.model.js   # Message schema
│   │
│   ├── routes/
│   │   ├── auth.routes.js     # Authentication routes
│   │   └── chat.routes.js     # Chat routes
│   │
│   ├── services/
│   │   ├── ai.service.js      # Google Gemini AI integration
│   │   └── vector.service.js  # Pinecone vector operations
│   │
│   └── sockets/
│       └── socket.server.js    # Socket.io server setup
│
├── server.js                  # Application entry point
├── package.json               # Dependencies and scripts
├── package-lock.json          # Locked dependency versions
└── .env                       # Environment variables (create this)
```

---

## 🎮 What You Can Do

### 1. **Build a Chat Application**

- Create a frontend (React, Vue, Angular, etc.) that connects to this backend
- Implement user registration and login
- Build a chat interface that uses Socket.io for real-time messaging

### 2. **AI-Powered Conversations**

- Users can have natural conversations with the AI
- The AI remembers context from previous messages
- Responses are formatted with HTML support

### 3. **Chat Management**

- Create multiple chat sessions
- Each chat maintains its own history
- Messages are stored in MongoDB for persistence

### 4. **Memory & Context**

- Short-term memory (STM): Last 20 messages in current chat
- Long-term memory (LTM): Relevant past conversations retrieved via vector search
- AI uses both to provide contextually relevant responses

### 5. **Vector-Based Search**

- Messages are converted to embeddings
- Stored in Pinecone for semantic search
- Enables finding relevant past conversations

### 6. **Real-time Communication**

- Instant message delivery via WebSocket
- No need to poll the server
- Efficient bidirectional communication

### 7. **Secure Authentication**

- JWT-based authentication
- Password hashing with bcrypt
- HTTP-only cookies for token storage

---

## 🔧 Technologies Used in Detail

### **Express.js**

- Fast, unopinionated web framework for Node.js
- Handles HTTP requests and routing
- Middleware support for authentication and parsing

### **MongoDB & Mongoose**

- NoSQL database for flexible data storage
- Mongoose provides schema validation and modeling
- Stores users, chats, and messages

### **Socket.io**

- Enables real-time, bidirectional communication
- WebSocket protocol for instant messaging
- Supports authentication via middleware

### **Google Gemini AI**

- **gemini-2.0-flash**: Fast, efficient model for chat responses
- **gemini-embedding-001**: Generates 768-dimensional vectors
- Custom system instructions for "Mira AI" personality

### **Pinecone**

- Managed vector database
- Stores message embeddings for semantic search
- Enables finding similar past conversations

### **JWT (JSON Web Tokens)**

- Stateless authentication
- Secure token-based sessions
- Stored in HTTP-only cookies

### **bcrypt**

- One-way password hashing
- Salt rounds for security
- Prevents password exposure

---

## 🐛 Troubleshooting

### Server won't start

- Check if MongoDB is running
- Verify all environment variables are set in `.env`
- Ensure port 5000 (or your specified port) is not in use

### Database connection error

- Verify `MONGO_URL` in `.env` is correct
- Check MongoDB service is running
- For MongoDB Atlas, ensure IP whitelist includes your IP

### AI not responding

- Verify `GOOGLE_GENAI_API_KEY` is valid
- Check API quota/limits
- Ensure internet connection is active

### Vector database errors

- Verify `PINECON_API_KEY` is correct
- Check Pinecone index name matches: `chatgpt-project`
- Ensure Pinecone index exists and is active

### Authentication issues

- Verify `JWT_SECRET` is set
- Check token expiration
- Ensure cookies are being sent with requests

---

## 📝 Notes

- The AI is configured as "Mira AI" - a playful and friendly assistant
- System supports HTML formatting in responses
- Vector embeddings use 768 dimensions
- Chat history limited to last 20 messages for STM
- Vector search retrieves top 3 relevant memories for LTM

---

## 🤝 Contributing

Feel free to fork this repository and submit pull requests for any improvements.

---

## 📄 License

ISC License

---

## 👤 Author

**Majid Saddiqye**

- GitHub: [@majidsaddiqye](https://github.com/majidsaddiqye)

---

## 🔗 Links

- [Repository](https://github.com/majidsaddiqye/Mira-AI-BackendRepo.git)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Pinecone](https://www.pinecone.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

**Happy Coding! 🚀**
