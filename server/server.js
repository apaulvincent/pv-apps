const server = require('express')();

const cors = require('cors')
server.use(cors())

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

 // Add this
 if (req.method === 'OPTIONS') {

      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Max-Age', 120);
      return res.status(200).json({});
  }

  next();

});


const http = require("http").createServer(server);

const io = require("socket.io")(http);

io.origins(['pv-apps.netlify.app:*']);

const dev = process.env.NODE_ENV !== 'production'

const ioport = process.env.IO_PORT || 9000

let activeRooms = []
let activeUsers = {}

io.on('connection', (socket) => {

      console.log('a user connected');

      // Set User
      socket.on("username", data => {

          const user = {
            "name": data.username,
            "id": socket.id,
            "room": data.room
          };

          activeUsers[socket.id] = user;
          
          if(!activeRooms.includes(data.room)){
            activeRooms.push(data.room)
          }
          
          socket.join(data.room);

          io.to(data.room).emit("connected", user);

          let selectedUsers = [] 

          Object.keys(activeUsers).filter(key => {
            if(activeUsers[key].room == data.room) {
              selectedUsers.push(activeUsers[key])
            }
          })

          io.to(data.room).emit("users", selectedUsers);
          io.emit("rooms", activeRooms);

      });




      // Messaging
      socket.on("send", message => {

        io.emit("message", {
          text: message,
          date: new Date().toISOString(),
          user: activeUsers[socket.id]
        });

      });



      // Disconnection
      socket.on('disconnect', () => {

        const user = activeUsers[socket.id];

        if(user){
          console.log(`${user.name} disconnected`);
          delete activeUsers[socket.id];
          io.emit("disconnected", socket.id);
        }

      });

});


http.listen(ioport)
