import vi from 'date-fns/locale/vi';
import { useState } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
registerLocale('vi', vi)

import { assets, cityList } from '../assets/assets';

const Hero = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState("");
    const [startDate, setStartDate] = useState(new Date());

    return (
        <div className='h-screen flex flex-col items-center justify-start pt-20 md:pt-24 gap-4 bg-[#f8faff] text-center px-4 overflow-hidden relative'>
            
            {/* 1. Tiêu đề: Giảm margin để nhường chỗ cho ảnh xe */}
            <div className='z-10'>
                <h1 className='text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight'>
                    Luxury cars on Rent
                </h1>
                <p className='text-gray-500 mt-1 text-sm md:text-base font-medium opacity-80'>
                    Premium driving experience in Vietnam
                </p>
            </div>

            {/* 2. Thanh Search */}
            <form className='flex flex-col md:flex-row items-center justify-between p-2 rounded-[2rem] md:rounded-full w-full max-w-lg md:max-w-3xl bg-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] border border-white z-20 transition-all hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)]'>
                <div className='flex flex-col md:flex-row items-center gap-2 md:gap-0 w-full px-4'>
                    
                    {/* Ô chọn địa điểm */}
                    <div className='relative w-full group flex flex-col items-start px-4 py-1 rounded-full hover:bg-gray-50 transition-colors cursor-pointer'>
                        <label className='block text-[10px] font-bold uppercase text-blue-500 tracking-wider ml-1 mb-1'>Pickup Location</label>
                        <div 
                            onClick={() => setIsOpen(!isOpen)}
                            className='w-full text-sm text-gray-800 font-semibold flex justify-between items-center h-5'
                        >
                            <span className={selectedCity ? 'text-gray-900' : 'text-gray-400'}>
                                {selectedCity || "Select city..."}
                            </span>
                            <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {isOpen && (
                            <div className="absolute top-full left-0 mt-4 w-64 bg-white/95 backdrop-blur-md shadow-2xl rounded-[1.5rem] py-3 z-50 border border-white overflow-hidden">
                                <div className="max-h-60 overflow-y-auto scrollbar-hide">
                                    {cityList && cityList.map((city, index) => (
                                        <div 
                                            key={index}
                                            onClick={() => { setSelectedCity(city); setIsOpen(false); }}
                                            className="px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer mx-2 rounded-xl font-medium"
                                        >
                                            {city}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className='hidden md:block h-10 w-[1px] bg-gray-100 mx-2'></div>

                    {/* Ô chọn ngày: Thêm dropdown chọn Tháng và Năm */}
                    <div className='flex flex-col items-start w-full px-4 py-1 rounded-full hover:bg-gray-50 transition-colors'>
                        <label className='block text-[10px] font-bold uppercase text-blue-500 tracking-wider ml-1 mb-1'>Date</label>
                        <div className='w-full text-sm text-gray-800 font-semibold h-5'>
                            <DatePicker 
                                selected={startDate} 
                                onChange={(date) => setStartDate(date)} 
                                dateFormat="dd/MM/yy"
                                locale="vi"
                                // Các thuộc tính để bật chọn nhanh tháng và năm
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                className="w-full bg-transparent outline-none cursor-pointer"
                                placeholderText="DD/MM/YY"
                            />
                        </div>
                    </div>
                </div>

                <button className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 w-full md:w-auto mt-2 md:mt-0 text-sm flex items-center justify-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                </button>
            </form>

           {/* 3. Hình ảnh xe: Tối ưu lại kích thước để to và cao hơn */}
            <div className='w-full max-w-7xl mt-auto mb-8 flex justify-center items-end flex-grow z-10'>
                <img 
                    src={assets.vf} 
                    alt="Car" 
                    // Tăng max-h lên 65vh và sử dụng drop-shadow mạnh hơn để xe nổi bật
                    className='w-auto max-h-[50vh] md:max-h-[60vh] lg:max-h-[65vh] object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.25)] animate-slide-up'
                />
            </div>
            {/* Hiệu ứng nền */}
            <div className='absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px] -z-10'></div>
        </div>
    )
}

export default Hero