const chatModel = require("../models/chat.model");

async function createChat(req, res) {
  try {
    const { title } = req.body;
    const user = req.user;

    const chat = await chatModel.create({
      user: user._id,
      title,
    });

    res.status(201).send({
      message: "Chat created successfully",
      chat: {
        id: chat._id,
        title: chat.title,
        lastActivity: chat.lastActivity,
        user: chat.user
      },
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createChat };
