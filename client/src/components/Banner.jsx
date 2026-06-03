import { motion } from 'motion/react';
import { assets } from '../assets/assets';

const Banner = () => {
    return (
        <motion.div
        initial={{opacity:0, y:50}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.6}}
        className='flex flex-col md:flex-row md:items-center justify-between px-8 lg:px-16 py-12 md:py-14 bg-gradient-to-r from-[#115E59] via-[#0D9488] to-[#14B8A6] max-w-6xl mx-3 md:mx-auto rounded-3xl overflow-hidden shadow-xl shadow-teal-900/10 antialiased'>
            
            <div className='text-white flex flex-col items-start text-left max-w-xl animate-fade-in'>
                {/* TIÊU ĐỀ: Sử dụng M PLUS 1 với độ dày font-extrabold (weight 800) giúp dấu tiếng Việt hiển thị siêu nét, không bị dính nét */}
                <h2 className='text-3xl md:text-4xl font-mplus font-extrabold tracking-tight leading-tight'>
                    Bạn đang sở hữu Xe ô tô?
                </h2>
                
                {/* MÔ TẢ PHỤ 1: Dùng Be Vietnam Pro font-medium tạo nét chữ thanh lịch, mượt mà */}
                <p className='mt-3 text-base font-bevietnam font-medium tracking-wide text-white/95'>
                    Tạo nguồn thu nhập thụ động dễ dàng bằng cách đăng tải xe lên VietTrav.
                </p>
                
                {/* MÔ TẢ PHỤ 2: Tiếp tục dùng Be Vietnam Pro với leading-relaxed giúp khoảng cách dòng thoáng đãng, dễ rà soát nội dung */}
                <p className='mt-2 text-sm md:text-base text-teal-50/90 font-bevietnam font-normal leading-relaxed'>
                    Chúng tôi sẽ lo toàn bộ thủ tục bảo hiểm, xác minh tài xế và bảo mật thanh toán - giúp bạn an tâm kiếm tiền không chút lo âu.
                </p>

                {/* NÚT BẤM: Dùng Be Vietnam Pro font-bold (thay thế class lỗi font-bevietnamprobold) */}
                <motion.button 
                whileHover={{scale:1.05}}
                whileTap={{scale:0.95}}
                className='px-7 py-3 bg-white hover:bg-teal-50 active:scale-95 transition-all text-[#115E59] font-bevietnam font-bold rounded-xl text-sm mt-6 shadow-md cursor-pointer tracking-wider uppercase text-center'>
                    Đăng ký cho thuê xe
                </motion.button>
            </div>

            {/* KHỐI HÌNH ẢNH BANNER CAR */}
            <div className='mt-10 md:mt-0 flex justify-center items-center pointer-events-none'>
                <motion.img 
                    initial={{opacity:0, x:50}}
                    whileInView={{opacity:1, x:0}}
                    transition={{duration:0.6, delay:0.4}}
                    src={assets.banner_car_image} 
                    alt="xe sang VietTrav" 
                    className='max-h-48 lg:max-h-56 w-auto object-contain drop-shadow-[-10px_20px_25px_rgba(0,0,0,0.25)] transition-transform duration-500 hover:scale-102' 
                    
                />
            </div>

        </motion.div>
    )
}

export default Banner;