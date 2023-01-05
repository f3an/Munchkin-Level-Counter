import { createContext } from 'react'
import { io } from 'socket.io-client'

// eslint-disable-next-line
const socketLink: any = process.env.REACT_APP_SERVER_LINK
export const socket = io(socketLink)

export const SocketContext = createContext(io())
