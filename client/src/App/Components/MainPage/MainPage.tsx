import { Box, Button, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { SocketContext } from '../../context'
import { Rooms } from './Rooms'

export const MainPage: React.FC = () => {
  const socket: Socket = useContext(SocketContext)
  const [name, setName] = useState<string>('')
  const [registred, setRegistred] = useState<boolean>(false)
  const [rooms, setRooms] = useState<roomList>()

  useEffect(() => {
    if (registred) {
      socket.emit('getRooms')
    }
    socket.on('reciveRooms', (data: roomList) => {
      setRooms(data)
    })
  }, [socket, registred])

  return (
    <Box>
      {registred ? (
        <Box>
          <Rooms rooms={rooms} />
        </Box>
      ) : (
        <Box>
          <TextField
            label='Name'
            variant='outlined'
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
          <Button
            variant='contained'
            onClick={() => {
              if (name !== '') {
                socket.emit('registerUser', name)
                setRegistred(true)
              }
            }}
          >
            login
          </Button>
        </Box>
      )}
    </Box>
  )
}

type room = {
  roomName: string
  usersConnected: number | undefined
  maximumSize: number
}

type roomList = room[]
