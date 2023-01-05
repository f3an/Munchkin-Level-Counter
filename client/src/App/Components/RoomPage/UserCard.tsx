import { Box } from '@mui/system'
import React from 'react'

export const UserCard: React.FC<{user: user}> = ({user}) => {
  return (
    <Box>
      <div key={user.id}>
        <h2>{user.userName}</h2>
        <div>Level: {user.level}</div>
        <div>Bonus: {user.bonus}</div>
        <div>Total: {user.level + user.bonus}</div>
      </div>
    </Box>
  )
}

type user = {
  id: string
  userName: string
  level: number
  bonus: number
}
