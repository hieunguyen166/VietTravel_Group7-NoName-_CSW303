import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';

const ManageBookings = () => {
    const {currency, axios} = useAppContext()
    const [bookings, setBookings] = useState([])

    const fetchOwnerBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/owner')
            data.success ? setBookings(data.bookings) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeBookingStatus = async (bookingId, status) => {
        try {
            const { data } = await axios.post('/api/bookings/change-status', { bookingId, status })
            if (data.success){
                toast.success(data.message)
                fetchOwnerBookings()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchOwnerBookings()
    }, [])

    return (
        /* Phủ font-bevietnam bao quát giúp bảng quản lý hiển thị mượt mà */
        <div className='px-4 pt-10 md:px-10 w-full font-bevietnam antialiased'>
            {/* VIỆT HÓA HOÀN TOÀN TIÊU ĐỀ COMPONENT */}
            <Title title="Quản Lý Đơn Đặt Xe" subTitle="Xem toàn bộ danh sách khách hàng đặt xe và cập nhật trạng thái phê duyệt đơn hàng." />
            
            <div className='max-w-4xl w-full rounded-xl overflow-hidden border border-borderColor mt-6 bg-white shadow-sm'>
                <table className='w-full border-collapse text-left text-sm text-gray-600'>
                    {/* TIÊU ĐỀ CỘT BẢNG (THEAD) ĐÃ ĐƯỢC VIỆT HÓA */}
                    <thead className='text-gray-400 bg-gray-50/70 text-xs uppercase tracking-wider border-b border-borderColor'>
                        <tr>
                            <th className="p-3.5 font-bold">Phương tiện</th>
                            <th className="p-3.5 font-bold max-md:hidden">Thời gian thuê</th>
                            <th className="p-3.5 font-bold">Tổng tiền</th>
                            <th className="p-3.5 font-bold max-md:hidden">Thanh toán</th>
                            <th className="p-3.5 font-bold">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, index) => (
                            <tr key={index} className='border-t border-borderColor hover:bg-gray-50/40 transition-colors'>
                                {/* Cột xe */}
                                <td className='p-3.5 flex items-center gap-3'>
                                    <img src={booking.car.image} alt="Car" className='h-12 w-12 aspect-square rounded-lg object-cover border border-gray-100 shrink-0'/>
                                    <div>
                                        <p className='font-bold text-gray-800 text-sm'>{booking.car.brand} {booking.car.model}</p>
                                        {/* Hiển thị thời gian thu gọn trên mobile */}
                                        <p className="text-xs text-gray-400 md:hidden mt-0.5 font-mplus font-semibold">
                                            {booking.pickupDate.split('T')[0]} đến {booking.returnDate.split('T')[0]}
                                        </p>
                                    </div>
                                </td>
                                
                                {/* Cột Thời gian (Desktop) - Dùng font-mplus cho chuỗi ngày tháng sắc nét */}
                                <td className='p-3.5 max-md:hidden font-mplus font-semibold text-gray-500 text-xs whitespace-nowrap'>
                                    {booking.pickupDate.split('T')[0]} <span className="text-gray-300 mx-1">→</span> {booking.returnDate.split('T')[0]}
                                </td>
                                
                                {/* Cột Tổng tiền - Dùng font-mplus font-bold hiển thị số tiền rõ ràng kèm toLocaleString */}
                                <td className='p-3.5 font-mplus font-bold text-gray-700 whitespace-nowrap'>
                                    {Number(booking.price).toLocaleString()} {currency}
                                </td>
                                
                                {/* Cột Phương thức thanh toán */}
                                <td className='p-3.5 max-md:hidden'>
                                    <span className='bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider scale-90 inline-block'>
                                        {booking.paymentMethod === 'online' ? 'Trực tuyến' : 'Trực tiếp'}
                                    </span>
                                </td>
                                
                                {/* Cột Hành động / Trạng thái: Đồng bộ 100% chuỗi Tiếng Việt */}
                                <td className='p-3.5'>
                                    {booking.status === 'Đang chờ xác nhận' ? (
                                        /* Dropdown chọn trạng thái hoạt động chính xác với Tiếng Việt */
                                        <select 
                                            value={booking.status} 
                                            onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                                            className='px-2.5 py-1 text-gray-600 bg-white border border-borderColor rounded-md outline-none text-xs font-semibold focus:border-[#115E59] focus:ring-2 focus:ring-teal-900/5 cursor-pointer'
                                        >
                                            <option value="Đang chờ xác nhận">Chờ duyệt</option>
                                            <option value="Đã xác nhận">Xác nhận</option>
                                            <option value="Đã hủy">Hủy bỏ</option>
                                        </select>
                                    ) : (
                                        /* Nhãn trạng thái tĩnh khi đơn đã được xử lý xong */
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide border ${
                                            booking.status === 'Đã xác nhận' 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                : 'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageBookings;