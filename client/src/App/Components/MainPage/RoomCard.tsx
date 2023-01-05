import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import { SocketContext } from '../../context'

export const RoomCard: React.FC<{ room: room }> = ({ room }) => {
  const socket: Socket = useContext(SocketContext)

  const hendleClick = () => {
    socket.emit('joinToRoom', room.roomName)
  }

  return (
    <Box
      key={room.roomName}
      sx={{ display: 'flex', justifyContent: 'space-evenly', alignContent: 'center' }}
    >
      <Typography>
        {room.roomName}, {room.usersConnected}/{room.maximumSize}
      </Typography>
      <Link to={`/room/${room.roomName}`} style={{ textDecoration: 'none' }} onClick={hendleClick}>
        <Button variant='contained'>Join</Button>
      </Link>
    </Box>
  )
}

type room = {
  roomName: string
  usersConnected: number | undefined
  maximumSize: number
}
