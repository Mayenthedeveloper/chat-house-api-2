const socketIo = require("socket.io");
const { sequelize } = require("../models");
const Message = require("../models").Message;

const users = new Map();
const userSockets = new Map();

const SocketServer = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "DELETE", "UPDATE"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", async (user) => {
      let sockets = [];

      if (users.has(user.id)) {
        const existingUser = users.get(user.id);
        existingUser.sockets = [...existingUser.sockets, ...[socket.id]];
        sockets = [...existingUser.sockets, ...[socket.id]];
        users.set(user.id, existingUser);
      } else {
        users.set(user.id, { id: user.id, sockets: [socket.id] });
        sockets.push(socket.id);
        userSockets.set(socket.id, user.id);
      }
      const onlineFriends = []; // ids
      const chatters = await getChatters(user.id); // query

      console.log(chatters);

      // notify his friends that user is now online
      for (let i = 0; i < chatters.length; i++) {
        if (users.has(chatters[i])) {
          const chatter = users.get(chatters[i]);
          chatter.sockets.forEach((socket) => {
            try {
              io.to(socket).emit("online", user);
            } catch (e) {}
          });
          onlineFriends.push(chatter.id);
        }
      }

      // send to user sockets which of his friends are online
      sockets.forEach((socket) => {
        try {
          io.to(socket).emit("friends", onlineFriends);
        } catch (e) {}
      });
    });

    socket.on("message", async (message) => {
      let sockets = [];

      if (users.has(message.fromuser.id)) {
        sockets = users.get(message.fromuser.id).sockets;
      }

      //   try {
      //     console.log({ message });
      //     if (users.has(message.fromuserId)) {
      //       sockets = users.get(message.fromuserId).sockets;
      //     }
      //   } catch (e) {
      //     console.log(e);
      //   }

      message.toUserId.forEach((id) => {
        if (users.has(id)) {
          sockets = [...sockets, ...users.get(id).sockets];
        }
      });

      try {
        const msg = {
          type: message.type,
          fromuserId: message.fromuser.id,
          chatId: message.chatId,
          message: message.message,
        };

        const savedMessage = await Message.create(msg);

        message.User = message.fromuser;
        message.fromuserId = message.fromuser.id;
        message.id = savedMessage.id;
        message.message = savedMessage.message;
        delete message.fromuser;

        sockets.forEach((socket) => {
          io.to(socket).emit("received", message);
        });
      } catch (e) {}
    });

    socket.on("typing", (message) => {
      message.toUserId.forEach((id) => {
        if (users.has(id)) {
          users.get(id).sockets.forEach((socket) => {
            io.to(socket).emit("typing", message);
          });
        }
      });
    });
    socket.on("disconnect", async () => {
      if (userSockets.has(socket.id)) {
        const user = users.get(userSockets.get(socket.id));

        if (user.sockets.length > 1) {
          user.sockets = user.sockets.filter((sock) => {
            if (sock !== socket.id) return true;

            userSockets.delete(sock);
            return false;
          });

          users.set(user.id, user);
        } else {
          const chatters = await getChatters(user.id);

          for (let i = 0; i < chatters.length; i++) {
            if (users.has(chatters[i])) {
              users.get(chatters[i]).sockets.forEach((socket) => {
                try {
                  io.to(socket).emit("offline", user);
                } catch (e) {}
              });
            }
          }

          userSockets.delete(socket.id);
          users.delete(user.id);
        }
      }
    });
  });
};

const getChatters = async (userId) => {
  try {
    //finding all users the user is chatting with
    const [results, metadata] = await sequelize.query(`
        select "cu"."userId" from "ChatUsers" as cu
        inner join (
            select "c"."id" from "Chats" as c
            where exists (
                select "u"."id" from "Users" as u
                inner join "ChatUsers" on u.id = "ChatUsers"."userId"
                where u.id = ${parseInt(userId)} and c.id = "ChatUsers"."chatId"
            )
        ) as cjoin on cjoin.id = "cu"."chatId"
        where "cu"."userId" != ${parseInt(userId)}
    `);
    return results.length > 0 ? results.map((el) => el.userId) : [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

module.exports = SocketServer;
