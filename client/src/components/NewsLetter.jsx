import { motion } from 'motion/react';
const NewsLetter = () => {
    return (
        /* Dùng font-bevietnam làm nền tảng tổng thể giúp toàn bộ chữ tiếng Việt mượt mà hơn */
        <motion.div 
            initial={{opacity:0, y:30}}
            whileInView={{opacity:1, y:0}}
            transition={{duration:0.6, ease: "easeOut"}}
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col items-center justify-center text-center space-y-2 max-md:px-4 my-10 mb-40 antialiased font-bevietnam"
        >
            
            {/* TIÊU ĐỀ CHÍNH: Chuyển sang font-bevietnam với độ dày lớn để tôn lên nét thanh thoát của tiếng Việt */}
            <motion.h1
            initial={{opacity:0, y:20}}
            whileInView={{opacity:1, y:0}}
            transition={{delay:0.2, duration:0.6, ease: "easeOut"}}
            className="md:text-4xl text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Không Bỏ Lỡ <span className="text-[#115E59]">Ưu Đãi Đặc Biệt!</span>
            </motion.h1>
            
            {/* ĐOẠN MÔ TẢ: Đồng bộ font-bevietnam giúp người dùng đọc thông tin dễ chịu, mềm mại */}
            <motion.p
                initial={{opacity:0, y:20}}
                whileInView={{opacity:1, y:0}}
                transition={{delay:0.3, duration:0.5, ease: "easeOut"}}
                className="md:text-base text-sm text-gray-400 font-medium tracking-wide max-w-xl pb-6 mt-2 opacity-90">
                Đăng ký nhận tin để cập nhật sớm nhất các chương trình khuyến mãi, dòng xe mới và những đặc quyền độc quyền từ VietTrav.
            </motion.p>
            
            {/* FORM ĐĂNG KÝ */}
            <motion.form
                initial={{opacity:0, y:20}}
                whileInView={{opacity:1, y:0}}
                transition={{delay:0.4, duration:0.5, ease: "easeOut"}}
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
            >
                {/* Ô NHẬP EMAIL: Sử dụng font-mplus font-bold giúp địa chỉ hòm thư sắc nét, cân đối */}
                <input
                    className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-4 text-gray-900 font-mplus font-bold text-sm placeholder:text-gray-400 focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all"
                    type="email"
                    placeholder="Nhập địa chỉ email của bạn..."
                    required
                />
                
                {/* NÚT SUBMIT: font-mplus font-bold làm khối chữ IN HOA trông rất đứng dáng và mang tính hành động cao */}
                <button 
                    type="submit" 
                    className="md:px-12 px-6 h-full text-white bg-[#115E59] hover:bg-[#0D9488] transition-all duration-300 cursor-pointer rounded-md rounded-l-none font-mplus font-bold text-sm tracking-wider uppercase whitespace-nowrap active:scale-[0.99]"
                >
                    Đăng ký
                </button>
            </motion.form>
        </motion.div>
    )
}

export default NewsLetter;