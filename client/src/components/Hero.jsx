import vi from 'date-fns/locale/vi';
import { useState } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
registerLocale('vi', vi);

import { motion } from 'motion/react';
import { assets, cityList } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Hero = () => {
    // Các const gốc của bạn
    const [pickupLocation, setPickupLocation] = useState('');
    const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext();
    
    // Thêm 1 state để quản lý loại xe (Mặc định là tự lái)
    const [driveType, setDriveType] = useState('self-drive'); 

    const handleSearch = (e) => {
        e.preventDefault();
        // Cập nhật URL để mang theo biến driveType sang trang /cars
        navigate(`/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}&driveType=${driveType}`);
    };

    return (
        <motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{duration:0.8}}
        className='min-h-screen flex flex-col items-center justify-start pt-32 md:pt-36 bg-[#f7faf9] text-center px-4 overflow-hidden relative antialiased font-bevietnam'>
            
            {/* 1. Tiêu đề - Tối ưu font chữ nghệ thuật Tiếng Việt */}
            <motion.div className='z-20 max-w-3xl animate-fade-in tracking-tight'>
                <motion.h1 initial={{y:50, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:0.8, delay:0.2}}
                className='text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight'>
                    Thuê Xe Ô Tô
                </motion.h1>
                <motion.h1 initial={{y:50, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:0.8, delay:0.2}}
                className='text-2xl md:text-4xl font-black text-[#115E59] mt-2'>
                    Trọn Vẹn Hành Trình Của Bạn
                </motion.h1>
                <motion.p initial={{y:50, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:0.8, delay:0.2}}
                className='text-gray-500 mt-4 text-sm md:text-lg font-medium tracking-wide max-w-xl mx-auto opacity-90'>
                    Trải nghiệm di chuyển tự do tuyệt đối tại Việt Nam cùng VietTrav.
                </motion.p>
            </motion.div>

            {/* 2. Khu vực Form Tìm kiếm (Bao gồm Toggle + Thanh Search) */}
            <div className="z-20 mt-12 flex flex-col items-center w-full max-w-xl lg:max-w-5xl">
                
                {/* THANH TOGGLE CHỌN LOẠI XE NẰM Ở ĐÂY */}
                <motion.div 
                    initial={{scale:0.95, opacity:0, y:20}}
                    animate={{scale:1, opacity:1, y:0}}
                    transition={{duration:0.6, delay:0.3}}
                    className="flex bg-gray-200/60 backdrop-blur-sm p-1.5 rounded-full mb-3 shadow-inner"
                >
                    <button
                        type="button"
                        onClick={() => setDriveType('self-drive')}
                        className={`px-6 py-2 md:px-8 md:py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                            driveType === 'self-drive' 
                            ? 'bg-white text-[#115E59] shadow-md scale-100' 
                            : 'text-gray-500 hover:text-gray-700 scale-95'
                        }`}
                    >
                        Xe tự lái
                    </button>
                    <button
                        type="button"
                        onClick={() => setDriveType('with-driver')}
                        className={`px-6 py-2 md:px-8 md:py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                            driveType === 'with-driver' 
                            ? 'bg-white text-[#115E59] shadow-md scale-100' 
                            : 'text-gray-500 hover:text-gray-700 scale-95'
                        }`}
                    >
                        Xe có tài xế
                    </button>
                </motion.div>

                {/* Thanh Tìm kiếm */}
                <motion.form 
                initial={{scale:0.95, opacity:0, y:50}}
                animate={{scale:1, opacity:1, y:0}}
                transition={{duration:0.6, delay:0.4}}
                onSubmit={handleSearch} className='flex flex-col lg:flex-row items-center justify-between p-3 rounded-[2rem] lg:rounded-full w-full bg-white shadow-[0_20px_50px_-15px_rgba(17,94,89,0.08)] border border-white transition-all hover:shadow-[0_25px_60px_-10px_rgba(17,94,89,0.14)]'>
                    <div className='flex flex-col lg:flex-row items-center gap-4 lg:gap-0 w-full px-2'>
                        
                        {/* CỤM 1: Địa điểm nhận xe */}
                        <div className='relative w-full flex flex-col items-start px-5 py-1.5 rounded-full hover:bg-teal-50/40 transition-colors'>
                            <label className='block text-[11px] md:text-xs font-black uppercase text-[#115E59] tracking-widest ml-1 mb-1.5'>
                                Địa điểm nhận xe
                            </label>
                            <select 
                                value={pickupLocation}
                                onChange={(e) => setPickupLocation(e.target.value)}
                                className='w-full text-sm md:text-base text-gray-900 font-bold bg-transparent outline-none cursor-pointer tracking-tight appearance-none'
                            >
                                <option value="" disabled hidden>Chọn thành phố...</option>
                                {cityList && cityList.map((city, index) => (
                                    <option key={index} value={city} className='text-gray-900 font-bold'>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className='hidden lg:block h-12 w-[1px] bg-gray-100 mx-2'></div>

                        {/* CỤM 2: Ngày nhận xe */}
                        <div className='flex flex-col items-start w-full px-5 py-1.5 rounded-full hover:bg-teal-50/40 transition-colors'>
                            <label className='block text-[11px] md:text-xs font-black uppercase text-[#115E59] tracking-widest ml-1 mb-1.5'>
                                Ngày nhận xe
                            </label>
                            <div className='w-full text-sm md:text-base text-gray-900 font-bold h-6 flex items-center font-mplus'>
                                <DatePicker 
                                    selected={pickupDate} 
                                    onChange={(date) => setPickupDate(date)} 
                                    dateFormat="dd / MM / yyyy"
                                    locale="vi"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    minDate={new Date()}
                                    className="w-full bg-transparent outline-none cursor-pointer tracking-wide font-bold text-gray-900"
                                    placeholderText="Chọn ngày"
                                />
                            </div>
                        </div>

                        <div className='hidden lg:block h-12 w-[1px] bg-gray-100 mx-2'></div>

                        {/* CỤM 3: Ngày trả xe */}
                        <div className='flex flex-col items-start w-full px-5 py-1.5 rounded-full hover:bg-teal-50/40 transition-colors'>
                            <label className='block text-[11px] md:text-xs font-black uppercase text-[#115E59] tracking-widest ml-1 mb-1.5'>
                                Ngày trả xe
                            </label>
                            <div className='w-full text-sm md:text-base text-gray-900 font-bold h-6 flex items-center font-mplus'>
                                <DatePicker 
                                    selected={returnDate} 
                                    onChange={(date) => setReturnDate(date)} 
                                    dateFormat="dd / MM / yyyy"
                                    locale="vi"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    minDate={pickupDate || new Date()}
                                    className="w-full bg-transparent outline-none cursor-pointer tracking-wide font-bold text-gray-900"
                                    placeholderText="Chọn ngày"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nút Tìm Kiếm */}
                    <motion.button
                    whileHover={{scale:1.05}}
                    whileTap={{scale:0.95}}
                    type="submit" className='bg-[#115E59] hover:bg-[#0D9488] text-white px-10 py-4 rounded-full font-mplus font-bold shadow-lg shadow-teal-900/10 transition-all active:scale-98 w-full lg:w-auto mt-4 lg:mt-0 text-sm md:text-base flex items-center justify-center gap-2 tracking-wider uppercase cursor-pointer whitespace-nowrap' initial={{scale:0.95, opacity:0, y:50}} animate={{scale:1, opacity:1, y:0}} transition={{duration:0.6, delay:0.4}}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Tìm kiếm xe
                    </motion.button>
                </motion.form>
            </div>

            {/* 3. Khu vực hình ảnh xe hiển thị kịch khung */}
            <div className='w-full max-w-5xl mt-12 md:mt-16 flex justify-center items-start z-10 pointer-events-none'>
                <motion.img 
                    src={assets.vf} 
                    alt="VietTrav Car" 
                    className='w-full h-auto object-contain drop-shadow-[0_35px_65px_rgba(17,94,89,0.2)] select-none animate-slide-up'
                    initial={{Y:100, opacity:0}}
                    animate={{Y:0, opacity:1}}
                    transition={{duration:0.8, delay:0.6}}
                />
            </div>
            
            {/* Hiệu ứng nền */}
            <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[30vh] bg-gradient-to-t from-teal-50/50 to-transparent blur-3xl -z-10'></div>
            <div className='absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-teal-100/10 rounded-full blur-[120px] -z-10'></div>
        </motion.div>
    );
};

export default Hero;