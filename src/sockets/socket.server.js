const { Server } = require("socket.io");
const cookie = require("cookie");
const JWT = require("jsonwebtoken");
const userModel = require("../models/user.model");
const generateResponse = require("../services/ai.service");
const messageModel = require("../models/message.model");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  //Socket Middleware

  io.use(async (socket, next) => {
    //Add Cookie Token in Headers
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies) {
      next(next(new Error("Token missing")));
    }

    //JWT Token Verifying
    try {
      const decoded = JWT.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication failed: " + error.message));
    }
  });

  // Connect to the server and AI Integration

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      
      //Save User message in Database
      await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: "user",
      });

      //Improve chat history handling and optimize short-term memory

      const chatHistory = (await messageModel.find({
        chat: messagePayload.chat,
      }).sort({createdAt:-1}).limit(20).lean()).reverse();

      // Formated chatHistory of GenAi Docs
      const formattedHistory = chatHistory.map((item) => ({
        role: item.role,
        parts: [{ text: item.content }],
      }));

      const response = await generateResponse(formattedHistory);

      //Save AI message in Database
      await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });

      //AI Response Code
      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
    });
  });
}

module.exports = initSocketServer;
