import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import Home from './pages/Home'
import MyBookings from './pages/MyBookings'

const App = () => {

    const [showLogin, setShowLogin] = useState(false)
    const isOwnerPath = useLocation().pathname.startsWith('/owner')

    return (
      <>
        {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}
        {/* Other components and routes */}
        <Routes>
          <Route path='/' element={<Home />} />
          {/* Add other routes here */}
          <Route path='/car-details/:id' element={<CarDetails/>} />
          <Route path='/cars' element={<Cars />} />
          <Route path='/my-bookings' element={<MyBookings />} />
        </Routes>
      </>
    )
  
}

export default App