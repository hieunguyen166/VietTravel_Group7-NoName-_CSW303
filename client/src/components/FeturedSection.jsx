import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import CarCard from "./CarCard";
import Title from "./Title";

const FeaturedSection = () => {
    const navigate = useNavigate();
    const {cars} = useAppContext();

    return (
        <motion.div 
            initial={{opacity: 0, y:40}}
            animate={{opacity: 1, y:0}}
            transition={{duration: 1, ease: "easeOut"}}
            className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-white antialiased'
        >

            {/* KHỐI TIÊU ĐỀ: Layout bọc ngoài đã có antialiased, truyền text mượt mà vào Title Component */}
            <motion.div
            initial={{opacity: 0, y:20}}
            animate={{opacity: 1, y:0}}
            transition={{duration: 1, delay: 0.5}}
            className='w-full text-center tracking-tight'>
                <Title 
                    title='Xe Nổi Bật' 
                    subTitle='Khám phá danh sách những chiếc xe chất lượng hàng đầu được tuyển chọn kỹ lưỡng, sẵn sàng nâng tầm trải nghiệm di chuyển của bạn.'
                />
            </motion.div>

            {/* LƯỚI DANH SÁCH XE: Hiển thị tối đa 6 xe nổi bật */}
            <motion.div 
            initial={{opacity: 0, y:100}}
            animate={{opacity: 1, y:0}}
            transition={{delay:0.5,duration: 1}}
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18 w-full'>
                {cars.slice(0, 6).map((car) => (
                    <motion.div
                    initial={{opacity: 0, scale:0.95}}
                    animate={{opacity: 1, scale:1}}
                    transition={{duration: 0.4, ease: "easeOut"}}
                    key={car._id}>
                        <CarCard car={car}/>
                    </motion.div>
                ))}
            </motion.div>

            {/* NÚT BẤM ĐIỀU HƯỚNG: 
                - Chuyển sang font-mplus font-bold (Weight 700) giúp dòng chữ in thường "Khám phá tất cả xe" trông dày dặn, công nghệ và rất chắc chắn.
                - Giữ nguyên hiệu ứng hover màu Xanh ngọc lục bảo thẫm thương hiệu (#115E59) của bạn.
            */}
            <motion.button
            initial={{opacity: 0, y:20}}
            whileInView={{opacity: 1, y:0}}
            transition={{delay: 0.6, duration: 0.4}}
                onClick={() => {
                    navigate('/cars'); window.scrollTo(0, 0);
                }}
                className='flex items-center justify-center gap-2 px-6 py-2.5 border border-borderColor hover:bg-teal-50/60 hover:text-[#115E59] hover:border-[#115E59] transition-all duration-300 rounded-md mt-18 cursor-pointer font-mplus font-bold text-sm text-gray-600 tracking-wide active:scale-98'
            >
                Khám phá tất cả xe 
                <img src={assets.arrow_icon} alt="arrow" className='w-4 h-4 object-contain transition-transform group-hover:translate-x-1'/>
            </motion.button>
        </motion.div>
    )
}

export default FeaturedSection;