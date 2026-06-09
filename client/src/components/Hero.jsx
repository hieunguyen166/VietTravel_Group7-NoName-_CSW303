import vi from 'date-fns/locale/vi';
import { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
registerLocale('vi', vi);

import { AnimatePresence, motion } from 'motion/react';
import { assets, cityList, heroBackgrounds } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Hero = () => {
    const [pickupLocation, setPickupLocation] = useState('');
    const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext();
    const [driveType, setDriveType] = useState('self-drive'); 
    
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % heroBackgrounds.length);
        }, 6000); // Tăng lên 6 giây cho cảm giác thư thái hơn
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}&driveType=${driveType}`);
    };

    return (
        <div className="relative w-full font-bevietnam overflow-hidden">
            {/* 1. Phần Ảnh nền với hiệu ứng Zoom nhẹ */}
            <div className="relative w-full h-[500px] bg-black">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        // Giữ opacity là 1 để không bị mờ
                        initial={{ opacity: 1, scale: 1.05 }} 
                        animate={{ opacity: 1, scale: 1 }}     
                        exit={{ opacity: 1, scale: 1.05 }}     
                        transition={{ duration: 6, ease: "linear" }} // Chạy suốt thời gian interval
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ 
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBackgrounds[currentIndex]})` 
                        }}
                    />
                </AnimatePresence>

                <div className="absolute inset-0 flex flex-col items-center pt-20 z-10">
                    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className='text-center px-4 text-white'>
                        <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight'>Thuê Xe Ô Tô</h1>
                        <h2 className='text-xl md:text-3xl font-black mt-3 text-white' style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.8), 0px 0px 10px rgba(17,94,89,0.9)' }}>
                            Trọn Vẹn Hành Trình Của Bạn
                        </h2>
                    </motion.div>
                </div>
            </div>

            {/* 2. Phần Thanh Search (Lấn lên trên nhờ negative margin) */}
            <div className="relative z-20 w-full max-w-5xl px-4 mx-auto -mt-24">
                <motion.div initial={{y: 30, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.5}}>
                    
                    {/* Toggle Switch hiện đại */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-white/90 backdrop-blur-md p-1 rounded-full shadow-lg flex border border-gray-100">
                            {['self-drive', 'with-driver'].map((type) => (
                                <button
    key={type}
    onClick={() => setDriveType(type)}
    className={`relative px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
        driveType === type ? 'text-white' : 'text-gray-500 hover:text-gray-800'
    }`}
>
    {driveType === type && (
        <motion.div 
            layoutId="activeTab" 
            className="absolute inset-0 bg-[#115E59] rounded-full shadow-sm" 
        />
    )}
    <span className="relative z-10">
        {type === 'self-drive' ? 'Xe tự lái' : 'Xe có tài xế'}
    </span>
</button>
                            ))}
                        </div>
                    </div>

                    {/* Form Tìm kiếm */}
                    <form onSubmit={handleSearch} className='flex flex-col lg:flex-row items-center justify-between p-3 rounded-[2rem] bg-white shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-gray-100'>
                        <div className='flex flex-col lg:flex-row items-center w-full px-2'>
                            <div className='w-full px-5 py-2'>
                                <label className='block text-[10px] font-black uppercase text-[#115E59] mb-1'>Địa điểm nhận xe</label>
                                <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className='w-full font-bold outline-none cursor-pointer'>
                                    <option value="">Chọn thành phố...</option>
                                    {cityList.map((city, i) => <option key={i} value={city}>{city}</option>)}
                                </select>
                            </div>
                            <div className='hidden lg:block h-10 w-[1px] bg-gray-200'></div>
                            <div className='w-full px-5 py-2'>
                                <label className='block text-[10px] font-black uppercase text-[#115E59] mb-1'>Ngày nhận xe</label>
                                <DatePicker selected={pickupDate} onChange={setPickupDate} dateFormat="dd/MM/yyyy" locale="vi" minDate={new Date()} className="w-full font-bold outline-none cursor-pointer" placeholderText="Chọn ngày" />
                            </div>
                            <div className='hidden lg:block h-10 w-[1px] bg-gray-200'></div>
                            <div className='w-full px-5 py-2'>
                                <label className='block text-[10px] font-black uppercase text-[#115E59] mb-1'>Ngày trả xe</label>
                                <DatePicker selected={returnDate} onChange={setReturnDate} dateFormat="dd/MM/yyyy" locale="vi" minDate={pickupDate || new Date()} className="w-full font-bold outline-none cursor-pointer" placeholderText="Chọn ngày" />
                            </div>
                        </div>
                        <button type="submit" className='bg-[#115E59] hover:bg-[#0D9488] text-white px-10 py-4 rounded-full font-bold uppercase transition-all shadow-lg hover:shadow-teal-500/30 w-full lg:w-auto'>
                            Tìm kiếm xe
                        </button>
                    </form>
                </motion.div>
            </div>
            {/* 3. Ảnh xe (Ngay dưới form, không quá xa) */}
                <motion.div 
                    initial={{opacity:0, y: 20}} animate={{opacity:1, y: 0}} transition={{delay: 0.3}}
                    className='w-full mt-8 md:mt-12 flex justify-center'
                >
                    <img src={assets.vf} alt="Car" className='w-full max-w-4xl h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)]' />
                </motion.div>
            {/* Khoảng cách phía dưới */}
            <div className="h-20"></div>
        </div>
    );
};

export default Hero;