import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'

const CarDetails = () => {

  const {id} = useParams()
  const {cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate} = useAppContext()
  const [car, setCar] = useState(null)
  const navigate = useNavigate()
  const currency = import.meta.env.VITE_CURRENCY || 'VND';

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const {data} = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate
      })
      if(data.success) {
        toast.success("Đặt xe thành công! Bạn có thể xem chi tiết đặt xe trong mục 'Đơn hàng của tôi'.")
        navigate('/my-bookings')
      }else{
        toast.error(data.message || "Đặt xe thất bại. Vui lòng thử lại.")
      }
    }catch(error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  }

  const featureTranslations = {
    "360 Camera": "Camera 360°",
    "Bluetooth": "Kết nối Bluetooth",
    "GPS Navigation": "Định vị GPS",
    "Heated Seats": "Sưởi ấm ghế",
    "Sunroof": "Cửa sổ trời",
    "Rear View Mirror": "Gương chiếu hậu chống chói"
  };

  useEffect(() => {
    setCar(cars.find(car => car._id === id))
  }, [cars, id])

  return car ? (
    /* Phủ font-bevietnam bao quát toàn bộ trang chi tiết phương tiện */
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 font-bevietnam antialiased'>

    {/* NÚT BACK: Việt hóa văn bản hướng dẫn */}
    <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-400 hover:text-[#0D9488] transition-colors font-medium cursor-pointer text-sm'>
        <img src={assets.arrow_icon} alt="Quay lại" className='rotate-180 opacity-60 w-4 h-4'/>
        Quay lại danh sách xe
    </button>

    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16'>
    {/* Cột bên trái: Hình ảnh xe & Thông số kỹ thuật chi tiết */}
    <motion.div 
    initial={{opacity:0, y:30}}
    animate={{opacity:1, y:0}}
    transition={{duration:0.6, ease: "easeOut"}}
    className='lg:col-span-2'>
        <motion.img 
        initial={{scale:0.98, opacity:0}}
        animate={{scale:1, opacity:1}}
        transition={{duration:0.5, ease: "easeOut"}}
        src={car.image} alt={`${car.brand} ${car.model}`} className='w-full h-auto md:max-h-100 object-cover rounded-2xl mb-6 shadow-md border border-gray-100'/>
        <motion.div 
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:0.2, duration:0.5, ease: "easeOut"}}
        className='space-y-6'>
            <div>
                {/* Tên xe dùng font-mplus font-extrabold cực kỳ đứng dáng và hiện đại */}
                <h1 className='text-3xl font-mplus font-extrabold text-gray-900 tracking-tight'>{car.brand} {car.model}</h1>
                <p className='text-gray-400 text-sm md:text-base mt-1 font-medium'>
                    {car.category} <span className="mx-1.5">•</span> Năm sản xuất <span className="font-mplus font-bold text-gray-600">{car.year}</span>
                </p>
            </div>
            
            <hr className='border-borderColor my-6' />
            
            {/* Hộp lưới thông số kỹ thuật (Grid Info) - Việt hóa nội dung hiển thị */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            {[
              {icon: assets.users_icon, text: `${car.seating_capacity} Chỗ ngồi`, isNumber: true},
              {icon: assets.fuel_icon, text: car.fuel_type === 'Petrol' ? 'Xăng' : car.fuel_type === 'Diesel' ? 'Dầu Diesel' : car.fuel_type === 'Electric' ? 'Điện' : car.fuel_type},
              {icon: assets.car_icon, text: car.transmission === 'Automatic' ? 'Số tự động' : 'Số sàn'},
              {icon: assets.location_icon, text: car.location},
            ].map(({icon, text, isNumber})=>(
              <motion.div 
              initial={{opacity:0, y:10}}
              animate={{opacity:1, y:0}}
              transition={{duration:0.4}}
              key={text} className='flex flex-col items-center bg-gray-50/80 border border-gray-100/50 p-4 rounded-xl text-xs md:text-sm font-bold text-gray-700 shadow-sm'>
                <img src={icon} alt="Icon" className='h-5 mb-2.5 opacity-80' />
                <span className={isNumber ? "font-mplus" : ""}>{text}</span>
              </motion.div>
            ))}
            </div>
            
            {/* Khung mô tả chi tiết */}
            <div className="bg-white rounded-xl border border-borderColor/60 p-5 shadow-sm">
              <h2 className='text-base font-bold text-gray-900 mb-3 border-l-4 border-[#115E59] pl-2.5'>Mô tả chi tiết</h2>
              <p className='text-gray-500 text-sm leading-relaxed font-medium'>{car.description}</p>
            </div>

            {/* Danh sách các tính năng/tiện nghi */}
            <div className="bg-white rounded-xl border border-borderColor/60 p-5 shadow-sm">
              <h2 className='text-base font-bold text-gray-900 mb-3 border-l-4 border-[#115E59] pl-2.5'>Trang bị tiện nghi</h2>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold text-gray-500'>
                {
                  ["360 Camera", "Bluetooth", "GPS Navigation", "Heated Seats", "Sunroof", "Rear View Mirror"].map((item) => (
                    <li key={item} className='flex items-center hover:text-gray-800 transition-colors'>
                      <img src={assets.check_icon} className='h-3.5 w-3.5 mr-2.5 bg-emerald-50 p-0.5 rounded-full border border-emerald-200' alt="Check"/>
                      {featureTranslations[item] || item}
                    </li>
                  ))
                }
              </ul>
            </div>
        </motion.div>
    </motion.div>

      {/* Cột bên phải: Form đặt xe (Sticky) */}
      <motion.form 
      initial={{opacity:0, y:30}}
      animate={{opacity:1, y:0}}
      transition={{delay:0.3, duration:0.6, ease: "easeOut"}}
      onSubmit={handleSubmit} className='shadow-xl h-max sticky top-24 rounded-2xl p-6 space-y-5 text-gray-500 bg-white border border-borderColor/60'>

        {/* Khối hiển thị giá: Dùng font-mplus font-extrabold làm nổi bật số tiền, định dạng toLocaleString */}
        <div className='flex items-baseline justify-between'>
          <p className='text-3xl font-mplus font-extrabold text-[#115E59] tracking-tight'>
            {Number(car.pricePerDay).toLocaleString()} <span className="text-sm font-bevietnam font-bold opacity-80">{currency}</span>
          </p>
          <span className='text-xs text-gray-400 font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-0.5 rounded'>/ Ngày</span>
        </div>

        <hr className='border-borderColor my-4'/>

        {/* Ô nhập Ngày nhận xe */}
        <div className='flex flex-col gap-1.5'>
          <label htmlFor="pickup-date" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Ngày nhận xe</label>
          <input value = {pickupDate} onChange = {(e) => setPickupDate(e.target.value)}
          type="date" className='border border-borderColor px-3 py-2 rounded-xl text-gray-900 font-mplus font-bold text-sm outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all bg-white cursor-pointer' required id='pickup-date' min={new Date().toISOString().split('T')[0]}/>
        </div>
        
        {/* Ô nhập Ngày trả xe */}
        <div className='flex flex-col gap-1.5'>
          <label htmlFor="return-date" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Ngày trả xe</label>
          <input value = {returnDate} onChange = {(e) => setReturnDate(e.target.value)} type="date" className='border border-borderColor px-3 py-2 rounded-xl text-gray-900 font-mplus font-bold text-sm outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all bg-white cursor-pointer' required id='return-date' min={new Date().toISOString().split('T')[0]}/>
        </div>

        {/* NÚT SUBMIT ĐẶT XE: Phối nền xanh thẫm #115E59, hiệu ứng hover #0D9488 và font-mplus mạnh mẽ */}
        <button className='w-full bg-[#115E59] hover:bg-[#0D9488] transition-all duration-300 py-3.5 font-mplus font-bold text-sm text-white rounded-xl uppercase tracking-wider cursor-pointer shadow-lg shadow-teal-900/10 active:scale-[0.99] mt-2'>
          Đặt xe ngay
        </button>
        
        <p className='text-center text-xs text-gray-400 font-medium'>Không yêu cầu thẻ tín dụng để giữ chỗ</p>
      </motion.form>
    </div>

  </div>
  ) : <Loader/>;
}

export default CarDetails