const server = require('express')();
const cors = require('cors')
server.use(cors())

const http = require("http").createServer(server);

const io = require("socket.io")(http);

// io.origins(['pv-apps.netlify.app:*']);

const dev = process.env.NODE_ENV !== 'production'

if (dev) {
  require('dotenv').config();
}

const port = process.env.PORT || 9000

let activeRooms = ['Public', 'Some Where']
let activeUsers = {}

io.on('connection', (socket) => {

      console.log('a user connected');

      // Show rooms so user can select them
      io.emit("show-rooms", activeRooms);


      // Create Room
      socket.on("create-room", data => {

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
          io.emit("show-rooms", activeRooms);

      });


      // Join Room
      socket.on("join-room", data => {

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
          io.emit("show-rooms", activeRooms);

      });


      // Messaging
      socket.on("send", message => {

        const user = activeUsers[socket.id]

        if(user.room) {
            io.to(user.room).emit("message", {
              text: message,
              date: new Date().toISOString(),
              user: user
            });
        }

      });


      // Laeve
      socket.on('leave', (room) => {

        try {

          socket.leave(room);
          socket.to(room).emit('disconnect');

        } catch(e) {

          console.log('[error]','leave room :', e);
          socket.emit('error','couldnt perform requested action');

        }

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


http.listen(port, function() {
  console.log(`IO listening on port ${port}`)
})
