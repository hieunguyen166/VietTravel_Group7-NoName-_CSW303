import { motion } from 'motion/react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { assets, menuLinks } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {

    const {setShowLogin, user, logout, isOwner, axios, setIsOwner} = useAppContext()

    const location = useLocation()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const changeRole = async ()=>{
        try {
            const { data } = await axios.post('/api/owner/change-role')
            if (data.success) {
                setIsOwner(true)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    
    return (
        <motion.div
        initial={{y:-20, opacity:0}}
        animate={{y:0, opacity:1}}
        transition={{duration:0.5}}
        className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all antialiased font-bevietnam
        ${location.pathname === "/" ? "bg-transparent" : "bg-light"}`}>
            
            <Link to="/">
                {/* Đồng bộ sang logo2:
                  - Tăng kích thước lên h-11 md:h-12 để hiển thị to, rõ ràng và sang trọng.
                  - Xóa bỏ thuộc tính scale cũ để logo neo lề trái thẳng hàng tăm tắp với nội dung trang.
                */}
                <motion.img whileHover={{scale:1.05}}
                    src={assets.logo2}
                    alt="logo VietTrav"
                    className="h-11 md:h-13 w-auto object-contain block"
                    initial={{y:-20, opacity:0}}
                    animate={{y:0, opacity:1}}
                    transition={{duration:0.5}}
                />
            </Link>

            <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 
            flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 
            max-sm:p-6 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-transparent max-sm:bg-white" : "bg-light"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
                
                {/* Vùng Menu Links: Sử dụng font-mplus giúp chữ menu đứng chữ, sắc nét, chuyển màu chữ khi hover sang Xanh thương hiệu #115E59 */}
                {menuLinks.map((link, index) => (
                    <Link 
                        key={index} 
                        to={link.path} 
                        className="px-2 font-mplus font-bold text-[15px] tracking-tight text-gray-700 hover:text-[#115E59] transition-colors duration-300"
                    >
                        {link.name}
                    </Link>
                ))}

                {/* Thanh tìm kiếm nhanh nội bộ: font-mplus tinh gọn */}
                <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor px-4 py-1.5 rounded-full max-w-56 bg-white/50 focus-within:border-[#115E59] focus-within:bg-white transition-all duration-300'>
                    <input 
                        type="text" 
                        className="w-full bg-transparent outline-none placeholder-gray-400 font-mplus font-semibold text-[13px]" 
                        placeholder="Tìm kiếm xe..." 
                    />
                    <img src={assets.search_icon} alt="search" className='w-4 h-4 opacity-70' />
                </div>
            
                <div className='flex max-sm:flex-col items-start sm:items-center gap-6 max-sm:w-full'>
                    {/* Bảng điều khiển đối tác xe */}
                    <button 
                        onClick={() => isOwner ? navigate('/owner') : changeRole()}
                        className="cursor-pointer font-mplus font-bold text-[15px] text-gray-700 hover:text-[#115E59] transition-colors duration-300 tracking-tight"
                    >
                        {isOwner ? 'Dashboard' : 'Danh sách xe' }
                    </button>
                    
                    {/* 🆕 KHU VỰC ĐÃ ĐƯỢC TÁCH BIỆT LOGIC ĐĂNG NHẬP / THÔNG TIN CÁ NHÂN */}
                    {user ? (
                        <div className="flex items-center gap-4 max-sm:flex-col max-sm:items-start max-sm:w-full max-sm:border-t max-sm:pt-4 max-sm:border-gray-200">
                            
                            {/* Khối link Avatar + Tên dẫn đến trang cá nhân */}
                            <Link 
                                to="/profile" 
                                onClick={() => setOpen(false)} // Tự đóng menu mobile khi click
                                className="flex items-center gap-2 group cursor-pointer"
                            >
                                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#115E59] transition-all bg-gray-100 shadow-sm">
                                    <img 
                                        src={user.image || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"} 
                                        alt="Avatar" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="font-mplus font-bold text-[14px] text-gray-700 group-hover:text-[#115E59] transition-colors tracking-tight">
                                    {user.name}
                                </span>
                            </Link>

                            {/* Nút đăng xuất tinh gọn, sang trọng hơn khi đã login */}
                            <button 
                                onClick={() => { logout(); setOpen(false); }} 
                                className="cursor-pointer px-4 py-1.5 border border-gray-300 hover:border-red-500 text-gray-500 hover:text-red-500 transition-all duration-300 rounded-lg font-mplus font-bold text-xs tracking-wider uppercase active:scale-95 max-sm:w-full text-center"
                            >
                                Logout
                            </button>

                        </div>
                    ) : (
                        /* Nút Đăng nhập nguyên bản của bạn khi chưa đăng nhập */
                        <button 
                            onClick={() => { setShowLogin(true); setOpen(false); }} 
                            className="cursor-pointer px-7 py-2 bg-[#115E59] hover:bg-[#0D9488] transition-all duration-300 text-white rounded-lg font-mplus font-bold text-sm tracking-wider uppercase shadow-md shadow-teal-900/5 active:scale-98 max-sm:w-full text-center"
                        >
                            Đăng nhập
                        </button>
                    )}
                </div>
            </div>

            {/* Nút Hamburger Menu cho thiết bị di động */}
            <button className='sm:hidden cursor-pointer p-1 active:scale-95 transition-transform' aria-label="Menu" onClick={() => setOpen(!open)}>
                <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className='w-6 h-6 object-contain' />
            </button>
        </motion.div>
    )
}

export default Navbar;