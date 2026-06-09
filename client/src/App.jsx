import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { useAppContext } from './context/AppContext';
import AdminDashboard from './pages/AdminDashboard';
import CarDetails from './pages/CarDetails';
import Cars from './pages/Cars';
import Home from './pages/Home';
import MyBookings from './pages/MyBookings';
import AddCar from './pages/owner/AddCar';
import Dashboard from './pages/owner/Dashboard';
import Layout from './pages/owner/Layout';
import ManageBooking from './pages/owner/ManageBooking';
import ManageCar from './pages/owner/ManageCar';
import UserProfile from './pages/UserProfile';
const AdminRoute = ({ children }) => {
    const { user } = useAppContext(); // hoặc dùng useContext(AppContext)
    return user?.role === 'admin' ? children : <Navigate to="/" />;
};

const App = () => {
    const { showLogin } = useAppContext();
    const isOwnerPath = useLocation().pathname.startsWith('/owner');

    return (
        <>
            <Toaster />
            {showLogin && <Login />}
            {!isOwnerPath && <Navbar />}
            
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/car-details/:id' element={<CarDetails />} />
                <Route path='/cars' element={<Cars />} />
                <Route path='/my-bookings' element={<MyBookings />} />
                <Route path='/profile' element={<UserProfile />} />
                
                <Route path='/owner' element={<Layout/>}>
                    <Route index element={<Dashboard/>}/>
                    <Route path="add-car" element={<AddCar/>}/>
                    <Route path="manage-cars" element={<ManageCar/>}/>
                    <Route path="manage-bookings" element={<ManageBooking/>}/>
                </Route>

                {/* Giờ đây nó đã gọi đúng Component bên ngoài */}
                <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>

            {!isOwnerPath && <Footer />}
        </>
    )
}

export default App;