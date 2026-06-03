import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { useAppContext } from '../context/AppContext';

const MyBookings = () => {

  const {axios, user, currency} = useAppContext();
    const [bookings, setBookings] = useState([])

    const fetchMyBookings = async () => {
        try {
            const {data} = await axios.get(`/api/bookings/user`);
            if(data.success) {
                setBookings(data.bookings)
            }else{
              toast.error('Không thể tải lịch sử đặt xe của bạn. Vui lòng thử lại sau.')
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi tải lịch sử đặt xe của bạn. Vui lòng thử lại sau.')
        }
    }

    useEffect(() => {
        user && fetchMyBookings()
    }, [user])

    return (
      /* Phủ font-bevietnam tạo không gian trang lịch sử đặt xe thanh lịch, tinh tế */
      <motion.div 
      initial={{opacity:0, y:30}}
      animate={{opacity:1, y:0}}
      transition={{duration:0.6}}
      className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mx-auto font-bevietnam antialiased mb-20'>

        {/* VIỆT HÓA HOÀN TOÀN TIÊU ĐỀ TRANG */}
        <Title title='Chuyến Đi Của Tôi' subTitle='Xem và quản lý toàn bộ danh sách lịch sử đơn đặt xe của bạn' align="left"/>

        <div className="space-y-6">
          {bookings.map((booking, index) => (
            /* Thẻ bọc từng đơn hàng: Nâng cấp border mượt mà và shadow nhẹ */
            <motion.div
              initial={{opacity:0, y:20}}
              animate={{opacity:1, y:0}}
              transition={{delay:index * 0.1, duration:0.4}}
              key={booking._id || index} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-xl mt-5 first:mt-12 bg-white shadow-sm hover:shadow-md transition-shadow duration-300'>
              
              {/* Cột 1: Hình ảnh xe & Thông tin cơ bản */}
              <div className='md:col-span-1'>
                <div className='rounded-lg overflow-hidden border border-gray-100 shadow-inner'>
                  <img src={booking.car.image} alt="Car" className='w-full h-auto aspect-video object-cover hover:scale-105 transition-transform duration-300' />
                </div>
                {/* Tên xe dùng font-mplus font-extrabold đứng dáng cứng cáp */}
                <p className='text-base font-mplus font-extrabold text-gray-900 mt-3 tracking-tight'>{booking.car.brand} {booking.car.model}</p>
                <p className='text-xs text-gray-400 mt-0.5 font-medium'>
                  Năm <span className="font-mplus font-bold text-gray-500">{booking.car.year}</span> <span className="mx-1">•</span> {booking.car.category}
                </p>
              </div>

              {/* Cột 2 & 3: Chi tiết lịch trình đặt xe */}
              <div className='md:col-span-2 space-y-4'>
                <div className='flex items-center gap-3.5'>
                  {/* Mã đơn đặt dùng font-mplus font-bold */}
                  <p className='px-2.5 py-1 bg-slate-50 border border-slate-100 rounded text-xs font-mplus font-bold text-gray-500 uppercase tracking-wide'>
                    Mã đơn #{index+1}
                  </p>
                  {/* Nhãn trạng thái (Status): Tự động đổi màu linh hoạt theo API dữ liệu Tiếng Việt */}
                  <p className={`px-3 py-0.5 text-xs font-bold rounded-full border ${
                    booking.status === 'Đã xác nhận' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : booking.status === 'Đang chờ xác nhận'
                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                      : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                  
{booking.status === 'Đã xác nhận' ? 'Đã xác nhận' : booking.status === 'Đang chờ xác nhận' ? 'Chờ duyệt' : 'Đã hủy'}                  </p>
                </div>

                {/* Khung thời gian thuê xe */}
                <div className='flex items-start gap-3 mt-3'>
                  <div className="p-1.5 bg-[#115E59]/5 rounded-lg shrink-0 mt-0.5 border border-[#115E59]/10">
                    <img src={assets.calendar_icon_colored} alt="Lịch" className='w-4 h-4' />
                  </div>
                  <div>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-wide'>Thời gian thuê</p>
                    {/* Dải ngày dùng font-mplus cho chữ số sắc nét */}
                    <p className='text-sm font-mplus font-bold text-gray-700 mt-0.5'>
                      {booking.pickupDate.split('T')[0]} <span className="text-gray-300 font-normal mx-1.5">đến</span> {booking.returnDate.split('T')[0]}
                    </p>
                  </div>
                </div>

                {/* Khung địa điểm nhận xe */}
                <div className='flex items-start gap-3'>
                  <div className="p-1.5 bg-[#115E59]/5 rounded-lg shrink-0 mt-0.5 border border-[#115E59]/10">
                    <img src={assets.location_icon_colored} alt="Địa điểm" className='w-4 h-4' />
                  </div>
                  <div>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-wide'>Địa điểm nhận xe</p>
                    <p className='text-sm font-semibold text-gray-700 mt-0.5'>{booking.car.location}</p>
                  </div>
                </div>
              </div>

              {/* Cột 4: Tổng tiền thanh toán (Căn phải trên Desktop) */}
              <div className='md:col-span-1 flex flex-col justify-between gap-4 md:text-right border-t md:border-t-0 md:border-l border-borderColor/60 pt-4 md:pt-0 md:pl-4'>
                <div className='text-sm text-gray-500 space-y-1'>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Tổng chi phí</p>
                  {/* Số tiền nổi bật: Dùng font-mplus font-extrabold kết hợp màu thương hiệu thẫm #115E59 */}
                  <h1 className='text-2xl font-mplus font-extrabold text-[#115E59] tracking-tight'>
                    {Number(booking.price).toLocaleString()} <span className="text-sm font-bevietnam font-bold opacity-80">{currency}</span>
                  </h1>
                  {/* Ngày tạo đơn */}
                  <p className="text-[11px] text-gray-400 font-medium">
                    Đặt ngày: <span className="font-mplus font-semibold">{booking.createdAt.split('T')[0]}</span>
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </motion.div>
    )
}

export default MyBookings