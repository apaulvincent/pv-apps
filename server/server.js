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

// PORT is inportant for Heroku
const port = process.env.PORT || 9000

let activeRooms = [{
    "name": "Public",
    "id" : "9900c413-5762-4251-a431-e07d146dc90d",
    "users": []
}]

let activeUsers = {}

const defaultRole = 1;

io.on('connection', (socket) => {

      console.log('a user connected');

      // Show rooms so user can select them
      socket.on("set-username", () => {

        io.emit("show-rooms", activeRooms);

      });
      
      socket.on("check-roomid", (roomid) => {

        const found = activeRooms.find(room => room.id == roomid)

        io.to(socket.id).emit("roomid-exists", found);

      })

      // Create Room
      socket.on("create-room", data => {

          const user = {
            "name": data.users[0],
            "id": socket.id,
            "room": data.id,
            "role": defaultRole
          };

          data.users = [socket.id]

          activeUsers[socket.id] = user;
          
          if(!activeRooms.find( room => room.id == data.id)){
            activeRooms.push(data)
          }
          
          socket.join(data.id);

          io.to(socket.id).emit("connected", user);

          let selectedUsers = [] 

          Object.keys(activeUsers).filter(key => {

            if(activeUsers[key].room == data.id) {
              selectedUsers.push(activeUsers[key])
            }

          })

          io.to(data.id).emit("users", selectedUsers);
          io.emit("show-rooms", activeRooms);

      });


      // Join Room
      socket.on("join-room", data => {

          const user = {
            "name": data.username,
            "id": socket.id,
            "room": data.room,
            "role": defaultRole
          };

          activeUsers[socket.id] = user;
        
          socket.join(data.room);

          activeRooms = activeRooms.map(room => {
              if(room.id == data.room){
                room.users.push(socket.id)
              }
              return room
          })

          io.to(socket.id).emit("connected", user);

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


      // Change Role
      socket.on("change-role", role => {

        const user = activeUsers[socket.id]

        activeUsers[socket.id].role = role
      
        let selectedUsers = [] 

        Object.keys(activeUsers).filter(key => {
          if(activeUsers[key].room == user.room) {
            selectedUsers.push(activeUsers[key])
          }
        })

        io.to(socket.id).emit("update-user", user);
        io.to(user.room).emit("users", selectedUsers);

    });


      /**
       * Play Cards 
       * 
       */

      socket.on("start-play", room => {
          io.to(room).emit("playing");
      });

      socket.on("stop-play", room => {
          io.to(room).emit("stop-playing");
      });

      socket.on("reset-play", room => {

          let selectedUsers = [] 

          Object.keys(activeUsers).filter(key => {
            if(activeUsers[key].room == room) {
              activeUsers[key].card = null;
              selectedUsers.push(activeUsers[key])
            }
          })

          io.to(room).emit("users", selectedUsers);
          io.to(room).emit("reseting");
      });

      socket.on("on-select-card", card => {

        const user = activeUsers[socket.id]

        activeUsers[socket.id].card = card
      
        let selectedUsers = [] 

        Object.keys(activeUsers).filter(key => {
          if(activeUsers[key].room == user.room) {
            selectedUsers.push(activeUsers[key])
          }
        })

        // io.to(socket.id).emit("update-user", user);
        io.to(user.room).emit("users", selectedUsers);
      
      });



      // Disconnection
      socket.on('disconnect', (reason) => {

        const user = activeUsers[socket.id]

        console.log(reason); 

        if(user){

          activeRooms = activeRooms.map(room => {

              if(room.id == user.room){

                const index = room.users.indexOf(user.id);

                if (index > -1) {
                    room.users.splice(index, 1);
                }

              }

              return room
          })

          console.log(`${user.name} disconnected`);

          delete activeUsers[socket.id];

          io.to(user.room).emit("disconnected", socket.id);

        }

      });

});


http.listen(port, function() {
  console.log(`IO listening on port ${port}`)
})
