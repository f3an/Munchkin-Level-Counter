import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainPage } from './Components/MainPage/MainPage'
import { SocketContext, socket } from './context'
import { RoomPage } from './Components/RoomPage/RoomPage'

function App() {
  return (
    <div className='App'>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/room/:roomName' element={<RoomPage />} />
          </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
    </div>
  )
}

export default App
