import express from 'express'
import http from 'http'
import { Server, Socket } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

let users: user[] = []
let availableRooms: roomList = []
const rooms = io.sockets.adapter.rooms

io.on('connection', (socket: Socket) => {
  console.log(`User connected ${socket.id}`)

  socket.on('getRooms', () => {
    socket.emit('reciveRooms', availableRooms)
  })

  socket.on('createRoom', (roomName: string) => {
    let found = false
    for (const room of availableRooms) {
      if (room.roomName === roomName) {
        found = true
        break
      }
    }
    if (!found) {
      socket.join(roomName)
      const room: room = {
        roomName: roomName,
        usersConnected: rooms.get(roomName)?.size,
        maximumSize: 10,
      }
      availableRooms.push(room)
    }

    socket.emit('reciveRooms', availableRooms)
    socket.broadcast.emit('reciveRooms', availableRooms)
  })

  socket.on('joinToRoom', (roomName: string) => {
    for (const room of availableRooms) {
      if (room.roomName === roomName) {
        socket.join(roomName)
        room.usersConnected = rooms.get(roomName)?.size
        break
      }
    }
    socket.broadcast.emit('reciveRooms', availableRooms)
  })

  socket.on('getUsersInRoom', async (roomName: string) => {
    const sockets = await io.in(roomName).fetchSockets()
    let usersInRoom: user[] = []
    for (const socket of sockets) {
      for (const user of users) {
        if (user.id === socket.id) {
          usersInRoom.push(user)
        }
      }
    }
    socket.emit('reciveUsersInRoom', usersInRoom)
    socket.broadcast.emit('reciveUsersInRoom', usersInRoom)
  })

  socket.on('incrementLevel', () => {
    for (const user of users) {
      if (user.id === socket.id) {
        user.level++
      }
    }
    socket.emit('reciveUsersInRoom', users)
    socket.broadcast.emit('reciveUsersInRoom', users)
  })

  socket.on('decrementLevel', () => {
    for (const user of users) {
      if (user.id === socket.id) {
        user.level--
      }
    }
    socket.emit('reciveUsersInRoom', users)
    socket.broadcast.emit('reciveUsersInRoom', users)
  })

  socket.on('decrementBonus', () => {
    for (const user of users) {
      if (user.id === socket.id) {
        user.bonus--
      }
    }
    socket.emit('reciveUsersInRoom', users)
    socket.broadcast.emit('reciveUsersInRoom', users)
  })

  socket.on('incrementBonus', () => {
    for (const user of users) {
      if (user.id === socket.id) {
        user.bonus++
      }
    }
    socket.emit('reciveUsersInRoom', users)
    socket.broadcast.emit('reciveUsersInRoom', users)
  })

  socket.on('registerUser', (name: string) => {
    users.push({ id: socket.id, userName: name, level: 1, bonus: 0 })
    socket.broadcast.emit('reciveUserList', users)
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected ${socket.id}`)
    users = users.filter((user) => user.id !== socket.id)
    socket.broadcast.emit('reciveUsersInRoom', users)
    for (const room of availableRooms) {
      room.usersConnected = rooms.get(room.roomName)?.size
      availableRooms = availableRooms.filter((room) => room.usersConnected !== undefined)
    }
    socket.broadcast.emit('reciveRooms', availableRooms)
  })
})

server.listen(3001, () => {
  console.log('server listening on 3001 port')
})

type user = {
  id: string
  userName: string
  level: number
  bonus: number
}

type room = {
  roomName: string
  usersConnected: number | undefined
  maximumSize: number
}

type roomList = room[]
