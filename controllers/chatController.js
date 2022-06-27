// exports.chatController = async function (req, res) {
//   try {

//     console.log("rrr")
//     io.use((socket, next) => {
//       const username = socket.handshake.auth.username;

//       console.log(username);
//       if (!username) {
//         return next(new Error("invalid username"));
//       }
//       socket.username = username;
//       next();
//     });

//     io.on("connection", (socket) => {
//       // fetch existing users
//       const users = [];
//       for (let [id, socket] of io.of("/").sockets) {
//         users.push({
//           userID: id,
//           username: socket.username,
//         });
//       }

//       console.log(users);
//       socket.emit("users", users);

//       // notify existing users
//       socket.broadcast.emit("user connected", {
//         userID: socket.id,
//         username: socket.username,
//       });

//       // forward the private message to the right recipient
//       socket.on("private message", ({ content, to }) => {
//         console.log(content, socket.id, to);
//         // const cnvr = new Conversation({
//         //   message: content,
//         //   sender: socket.id,
//         //   receiver: to,
//         // });

//         // console.log(cnvr);

//         // cnvr.save().then((data) => {
//         //   console.log(data);
//         // }).catch(err=>{
//         //     console.log(err);
//         // })

//         // console.log("P" + cnvr);
//         socket.to(to).emit("private message", {
//           content,
//           from: socket.id,
//         });
//       });

//       // notify users upon disconnection
//       socket.on("disconnect", () => {
//         socket.broadcast.emit("user disconnected", socket.id);
//       });
//     });
//   } catch (error) {}
// };
