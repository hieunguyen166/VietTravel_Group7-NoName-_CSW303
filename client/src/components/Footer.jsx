import { motion } from 'motion/react';
import { assets } from '../assets/assets';

const Footer = () => {
    return (
        <motion.div 
            initial={{opacity:0, y:30}}
            whileInView={{opacity:1, y:0}}
            transition={{duration:0.6, ease: "easeOut"}}
            className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500 bg-white antialiased font-bevietnam'
        >
            <motion.div
            initial={{opacity:0, y:20}}
            whileInView={{opacity:1, y:0}}
            transition={{duration:0.6, delay:0.2, ease: "easeOut"}}
            className='flex flex-wrap justify-between items-start gap-8 pb-6 border-gray-100 border-b'>
                
                {/* Cột 1: Giới thiệu chung & Mạng xã hội */}
                <div className='max-w-80'>
                    {/* Đổi sang logo2 và tăng kích thước lên h-12 (md:h-14) để tạo điểm nhấn thương hiệu lớn hơn */}
                    <motion.img
                        initial={{opacity:0}}
                        whileInView={{opacity:1}}
                        transition={{duration:0.5, delay:0.3}}
                        src={assets.logo2} 
                        alt="logo VietTrav" 
                        className='mb-4 h-12 md:h-14 w-auto min-w-[120px] md:min-w-[150px] object-contain object-left ml-1 block' 
                    />
                    <motion.p
                        initial={{opacity:0}}
                        whileInView={{opacity:1}}
                        transition={{duration:0.5, delay:0.4, ease: "easeOut"}}
                    className='max-w-80 mt-3 text-gray-400 leading-relaxed tracking-wide text-[13px]'>
                        Dịch vụ cho thuê xe sang hàng đầu với hệ thống xe đa dạng, mức giá cạnh tranh và đội ngũ hỗ trợ tận tâm. Trải nghiệm hành trình tự do tuyệt vời cùng chúng tôi.
                    </motion.p>
                    <motion.div
                        initial={{opacity:0}}
                        whileInView={{opacity:1}}
                        transition={{duration:0.5, delay:0.5, ease: "easeOut"}}
                    className='flex items-center gap-4 mt-6'>
                        <a href="#" className='hover:opacity-75 transition-opacity duration-300'> <img src={assets.facebook_logo} className='w-5 h-5' alt="Facebook" /> </a>
                        <a href="#" className='hover:opacity-75 transition-opacity duration-300'> <img src={assets.instagram_logo} className='w-5 h-5' alt="Instagram" /> </a>
                        <a href="#" className='hover:opacity-75 transition-opacity duration-300'> <img src={assets.twitter_logo} className='w-5 h-5' alt="Twitter" /> </a>
                        <a href="#" className='hover:opacity-75 transition-opacity duration-300'> <img src={assets.gmail_logo} className='w-5 h-5' alt="Gmail" /> </a>
                    </motion.div>
                </div>

                <motion.div
                intial={{opacity:0, y:20}}
                whileInView={{opacity:1, y:0}}
                transition={{duration:0.6, delay:0.4, ease: "easeOut"}}
                className='flex flex-wrap justify-between w-1/2 gap-8'>
                    {/* Cột 2: Liên kết nhanh */}
                    <div>
                        <h2 className='text-xs font-mplus font-bold text-gray-800 uppercase tracking-widest'>Liên Kết Nhanh</h2>
                        <ul className='mt-4 flex flex-col gap-2.5 font-medium text-[13px] text-gray-500'>
                            <li><a href="#" className='hover:text-[#115E59] transition-colors duration-300'>Trang chủ</a></li>
                            <li><a href="#" className='hover:text-[#115E59] transition-colors duration-300'>Danh sách xe</a></li>
                            <li><a href="#" className='hover:text-[#115E59] transition-colors duration-300'>Đăng ký cho thuê xe</a></li>
                            <li><a href="#" className='hover:text-[#115E59] transition-colors duration-300'>Về chúng tôi</a></li>
                        </ul>
                    </div>
                    {/* Cột 3: Hỗ trợ & Chính sách */}
                    <div>
                        <h2 className='text-xs font-mplus font-bold text-gray-800 uppercase tracking-widest'>Hỗ Trợ & Chính Sách</h2>
                        <ul className='mt-4 flex flex-col gap-2.5 font-medium text-[13px] text-gray-500'>
                            <li><a href="#" className='hover:text-[#115E59] transition-colors duration-300'>Trung tâm trợ giúp</a></li>
                            <li><a href="#" className='hover:text-[#115E59] transition-colors duration-300'>Điều khoản dịch vụ</a></li>
                            <li><a href="#" className='hover:text-[#115E59] transition-colors duration-300'>Chính sách bảo mật</a></li>
                            <li><a href="#" className='hover:text-[#115E59] transition-colors duration-300'>Chính sách bảo hiểm</a></li>
                        </ul>
                    </div>
                    {/* Cột 4: Thông tin liên hệ */}
                    <div>
                        <h2 className='text-xs font-mplus font-bold text-gray-800 uppercase tracking-widest'>Liên Hệ</h2>
                        <ul className='mt-4 flex flex-col gap-2.5 text-gray-500 font-medium text-[13px]'>
                            <li className='text-gray-400 font-normal tracking-tight'>1234 Nguyễn Du, Quận 1, TP. Hồ Chí Minh</li>
                            <li><a href="tel:+84123456789" className='hover:text-[#115E59] transition-colors duration-300 font-mplus font-bold text-[14px] tracking-tight'>+84 123 456 789</a></li>
                            <li><a href="mailto:info@viettrav.com" className='hover:text-[#115E59] transition-colors duration-300'>info@viettrav.com</a></li>
                        </ul>
                    </div>
                </motion.div>
            </motion.div>

            {/* Phần bản quyền & Thanh chân trang cuối */}
            <motion.div
            initial={{opacity:0, y:10}}
            whileInView={{opacity:1, y:0}}
            transition={{duration:0.6, delay:0.5, ease: "easeOut"}}
            className='flex flex-col md:flex-row gap-3 items-center justify-between py-6 text-gray-400 text-xs font-medium tracking-wide'>
                <p>© <span className='font-mplus font-semibold'>{new Date().getFullYear()}</span> VietTrav. Bảo lưu mọi quyền.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#" className='hover:text-[#115E59] transition-colors duration-300'>Bảo mật</a></li>
                    <li className='text-gray-200 select-none font-normal'>|</li>
                    <li><a href="#" className='hover:text-[#115E59] transition-colors duration-300'>Điều khoản</a></li>
                    <li className='text-gray-200 select-none'>|</li>
                    <li><a href="#" className='hover:text-[#115E59] transition-colors duration-300'>Sơ đồ trang</a></li>
                </ul>
            </motion.div>
        </motion.div>
    )
}

export default Footer;