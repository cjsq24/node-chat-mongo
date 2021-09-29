import { Server } from 'socket.io'

let socketServer = {}

const socket = (server) => {
   socketServer = new Server(server, {
      cors: {
         origins: "*:*",
         //methods: ["GET", "POST"]
      }
   })

   socketServer.on('connection', server => {
      server.on('hello', (data) => {
         console.log(data)
      })
   });

   return socketServer
}

export default socket
export {
   socketServer
}