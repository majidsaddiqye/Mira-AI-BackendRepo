const { Server } = require("socket.io");
const cookie = require("cookie");
const JWT = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { generateResponse, generateVector } = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, querMemory } = require("../services/vector.service");

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
      const message = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: "user",
      });

      //Convert input into vector and saved into Pineconn
      const vectors = await generateVector(messagePayload.content);

      //Search relevant Data into Vector DB
      const memory = await querMemory({
        queryVector: vectors,
        limit: 3,
        metadata: {
          user: socket.user._id,
        },
      });

      // Saved into vector DB
      await createMemory({
        vector: vectors,
        messageId: message._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: messagePayload.content,
        },
      });

      //Improve chat history handling and optimize short-term memory

      const chatHistory = (
        await messageModel
          .find({
            chat: messagePayload.chat,
          })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
      ).reverse();

      // STM chatHistory of GenAi Docs
      const STM = chatHistory.map((item) => ({
        role: item.role,
        parts: [{ text: item.content }],
      }));
      // LTM Chat History
      const LTM = [
        {
          role: "user",
          parts: [
            {
              text: `Tyese are Some Previous messages from the chat, use them to generate a response ${memory
                .map((item) => item.metadata.text)
                .join("\n")}`,
            },
          ],
        },
      ];

      const response = await generateResponse([...LTM, ...STM]);

      //Save AI message in Database
      const responseMessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });

      //Convert Output into vector and saved into Pineconn
      const responeVectors = await generateVector(response);
      await createMemory({
        vector: responeVectors,
        messageId: responseMessage._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response,
        },
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
