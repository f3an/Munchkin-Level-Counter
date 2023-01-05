import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import { SocketContext } from '../../context'
import { UserCard } from './UserCard'

export const RoomPage: React.FC = () => {
  const roomName = useParams().roomName
  const socket: Socket = useContext(SocketContext)
  const [users, setUsers] = useState<userList>([])
  const mainUser = users.filter((user: user) => user.id === socket.id)[0]

  useEffect(() => {
    socket.emit('getUsersInRoom', roomName)
    socket.on('reciveUsersInRoom', (data: userList) => {
      setUsers(data)
    })
  }, [socket])

  console.log(users)

  return (
    <Box>
      {mainUser ? (
        <Box>
          <Typography variant='h3'>{mainUser.userName}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Typography>Level: {mainUser.level}</Typography>
            <Button
              variant='text'
              onClick={() => {
                socket.emit('incrementLevel')
              }}
            >
              +
            </Button>
            <Button
              variant='text'
              onClick={() => {
                socket.emit('decrementLevel')
              }}
            >
              -
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Typography>Bonus: {mainUser.bonus}</Typography>
            <Button
              variant='text'
              onClick={() => {
                socket.emit('incrementBonus')
              }}
            >
              +
            </Button>
            <Button
              variant='text'
              onClick={() => {
                socket.emit('decrementBonus')
              }}
            >
              -
            </Button>
          </Box>
          <Typography>Total: {mainUser.level + mainUser.bonus}</Typography>
        </Box>
      ) : (
        ''
      )}
      <Box>
        {users
          ? users
            .filter((user: user) => user.id !== socket.id)
            .map((user: user) => <UserCard user={user} key={user.id} />)
          : ''}
      </Box>
    </Box>
  )
}
type userList = user[]
type user = {
  id: string
  userName: string
  level: number
  bonus: number
}
