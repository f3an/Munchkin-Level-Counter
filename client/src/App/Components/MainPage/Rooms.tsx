import { Button, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import { SocketContext } from '../../context'
import { RoomCard } from './RoomCard'

export const Rooms: React.FC<{ rooms: roomList | undefined }> = ({ rooms }) => {
  const socket: Socket = useContext(SocketContext)
  const [roomName, setRoomName] = useState('')

  const hendleClick = () => {
    if (roomName !== '') {
      socket.emit('createRoom', roomName)
      setRoomName('')
    }
  }

  return (
    <Box>
      <Box>
        <TextField
          label='Room Name'
          variant='outlined'
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value)
          }}
        ></TextField>
        <Link to={`/room/${roomName}`}>
          <Button variant='contained' onClick={hendleClick}>
            Create Room
          </Button>
        </Link>
      </Box>
      {rooms && rooms.length > 0
        ? rooms.map((room) => <RoomCard key={room.roomName} room={room} />)
        : 'No avalible rooms'}
    </Box>
  )
}

type room = {
  roomName: string
  usersConnected: number | undefined
  maximumSize: number
}

type roomList = room[]
