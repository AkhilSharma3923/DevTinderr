const socketIO = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      // we nedd to create a seprate room with unique id
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + "Joinning room : " + roomId);

      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName,userId, targetUserId, text }) => {
        // save message in DB

        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          // Example broadcast

          console.log(firstName + " " + text);

          let chat = await Chat.findOne({
            participants: { $all: [ userId, targetUserId ] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
             firstName,
  lastName,
            text,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, lastName,text });
        } catch (error) {}
      }
    );

    socket.on("disconnect", () => {
      //   console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
