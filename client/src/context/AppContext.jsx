import axios from 'axios';
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children })=>{

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY
    const backendUrl = import.meta.env.VITE_BASE_URL;
    // FIX 1: Lấy thẳng token từ localStorage lúc khởi tạo state để tránh bất đồng bộ
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [user, setUser] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [pickupDate, setPickupDate] = useState('')
    const [returnDate, setReturnDate] = useState('')

    const [cars, setCars] = useState([])

    //Function to check if user is logged in
    const fetchUser = async ()=>{
        try {
            const {data} = await axios.get('/api/user/data')
            if (data.success) {
                setUser(data.user)
                setIsOwner(data.user.role === 'owner')
            }else{
                navigate('/')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to fetch all cars from the server
    const fetchCars = async () => {
        try {
            const {data} = await axios.get('/api/user/cars')
            data.success ? setCars(data.cars) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

        const login = (userData, token) => {
        localStorage.setItem('token', token);
        setToken(token);
        setUser(userData);
        setIsOwner(userData.role === 'owner');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setShowLogin(false); // Đóng modal login
    };

    //Function to log out the user
    const logout = ()=>{
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization'] = ''
        toast.success('You have been logged out')
    }

    // FIX 2: useEffect này bây giờ chỉ làm nhiệm vụ lấy danh sách xe khi vào ứng dụng
    useEffect(()=>{
        fetchCars()
    },[])

    // useEffect to fetch user data when token is available
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            // Đồng bộ lại token vào localStorage phòng trường hợp setToken được gọi khi đăng nhập
            localStorage.setItem('token', token)
            fetchUser()
        }
    },[token])

    const value = {
        backendUrl, navigate, currency, axios, user, setUser, token, setToken, isOwner, setIsOwner, fetchUser, showLogin, setShowLogin, logout, fetchCars, cars, setCars, pickupDate, setPickupDate, returnDate, setReturnDate, login
    }

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = () =>{
    return useContext(AppContext)
}