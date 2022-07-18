// module.exports = class ChatService{
//     static async apiChat(bodyData){
//       try {
//         console.log("here")
//         io.use(async (socket, next) => {
//           const username = socket.handshake.auth.username;
        
//           console.log("here" + username, socket.id);
        
//           if (!username) {
//             return next(new Error("invalid username"));
//           }
//           socket.username = username;
//           next();
//         });
  
//         io.on("connection", (socket) => {
//           // fetch existing users
//           const users = [];
//           for (let [id, socket] of io.of("/").sockets) {
//             users.push({
//               userID: id,
//               username: socket.username,
//             });
//           }
        
//           // console.log(users)
//           socket.emit("users", users);
        
//           // notify existing users
//           socket.broadcast.emit("user connected", {
//             userID: socket.id,
//             username: socket.username,
//           });
        
//           // forward the private message to the right recipient
//           socket.on("private message", async ({ content, to }) => {
//             socket.to(to).emit("private message", {
//               content,
//               from: socket.id,
//             });
//           });
        
//           // notify users upon disconnection
//           socket.on("disconnect", () => {
//             socket.broadcast.emit("user disconnected", socket.id);
//           });
//         });
//       } catch (error) {
        
//       }
//     }
//   }