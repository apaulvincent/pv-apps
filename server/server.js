const server = require('express')();

const cors = require('cors')
server.use(cors())

const corsfn = (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if ( req.method === 'OPTIONS' ) {
      res.writeHead(200);
      res.end();
      return;
    }
}

const http = require("http").createServer(server); // corsfn

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


http.listen(ioport, function() {
  console.log(`IO listening on port ${ioport}`)
})
