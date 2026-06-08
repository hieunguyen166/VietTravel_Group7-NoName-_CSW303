import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';

const ManageBookings = () => {
    const { currency, axios } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // State quản lý Modal
    const [userHistory, setUserHistory] = useState([]);
    const fetchOwnerBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/owner');
            data.success ? setBookings(data.bookings) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const changeBookingStatus = async (bookingId, status) => {
        try {
            const { data } = await axios.post('/api/bookings/change-status', { bookingId, status });
            if (data.success) {
                toast.success(data.message);
                fetchOwnerBookings();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

const handleViewUser = async (user) => {
    try {
        console.log("Đang tải lịch sử cho user:", user._id);
        // Dùng GET thay vì POST
        const { data } = await axios.get(`/api/bookings/user-history/${user._id}`);
        
        if (data.success) {
            setUserHistory(data.history);
            setSelectedUser(user); // Mở modal sau khi đã có dữ liệu
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error("Không thể tải lịch sử thuê xe");
    }
};

    useEffect(() => {
        fetchOwnerBookings();
    }, []);

    return (
        <div className='px-4 pt-10 md:px-10 w-full font-bevietnam antialiased'>
            <Title title="Quản Lý Đơn Đặt Xe" subTitle="Xem toàn bộ danh sách khách hàng đặt xe và cập nhật trạng thái phê duyệt đơn hàng." />
            
            <div className='max-w-5xl w-full rounded-xl overflow-hidden border border-borderColor mt-6 bg-white shadow-sm'>
                <table className='w-full border-collapse text-left text-sm text-gray-600'>
                    <thead className='text-gray-400 bg-gray-50/70 text-xs uppercase tracking-wider border-b border-borderColor'>
                        <tr>
                            <th className="p-3.5 font-bold">Phương tiện</th>
                            <th className="p-3.5 font-bold">Người thuê</th>
                            <th className="p-3.5 font-bold max-md:hidden">Thời gian thuê</th>
                            <th className="p-3.5 font-bold">Tổng tiền</th>
                            <th className="p-3.5 font-bold">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, index) => (
                            <tr key={booking._id || index} className='border-t border-borderColor hover:bg-gray-50/40 transition-colors'>
                                <td className='p-3.5 flex items-center gap-3'>
                                    <img 
                                        src={booking.car?.image || assets.default_car_icon} 
                                        alt="Car" 
                                        className='h-12 w-12 aspect-square rounded-lg object-cover border border-gray-100 shrink-0'
                                    />
                                    <p className='font-bold text-gray-800 text-sm'>
                                        {booking.car ? `${booking.car.brand} ${booking.car.model}` : "Xe không xác định"}
                                    </p>
                                </td>
                                
                                    <td className='p-3.5'>
                                        <button 
                                            onClick={() => handleViewUser(booking.user)} // Kiểm tra kỹ chỗ này
                                            className='text-[#115E59] font-bold text-sm hover:underline'
                                        >
                                            {booking.user?.name || "Khách hàng"}
                                        </button>
                                    </td>
                                
                                <td className='p-3.5 max-md:hidden font-mplus font-semibold text-gray-500 text-xs whitespace-nowrap'>
                                    {booking.pickupDate?.split('T')[0]} → {booking.returnDate?.split('T')[0]}
                                </td>
                                
                                <td className='p-3.5 font-mplus font-bold text-gray-700 whitespace-nowrap'>
                                    {Number(booking.price || 0).toLocaleString()} {currency}
                                </td>
                                
                                <td className='p-3.5'>
                                    {booking.status === 'Đang chờ xác nhận' ? (
                                        <select 
                                            value={booking.status} 
                                            onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                                            className='px-2.5 py-1 text-gray-600 bg-white border border-borderColor rounded-md outline-none text-xs font-semibold cursor-pointer'
                                        >
                                            <option value="Đang chờ xác nhận">Chờ duyệt</option>
                                            <option value="Đã xác nhận">Xác nhận</option>
                                            <option value="Đã hủy">Hủy bỏ</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${booking.status === 'Đã xác nhận' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {booking.status}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal thông tin người thuê - Hiển thị ảnh trực tiếp */}
{selectedUser && (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        {/* Tăng max-w-md thành max-w-lg để to hơn */}
        <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in duration-200">
            {/* Tăng kích thước chữ tiêu đề */}
            <h3 className="font-extrabold text-2xl mb-6 border-b pb-4 text-gray-800">Thông tin người thuê</h3>
            
            {/* Tăng kích thước chữ cho nội dung thông tin */}
            <div className="space-y-4 text-lg text-gray-700">
                <p><span className="font-bold text-gray-900">Họ tên:</span> {selectedUser.name}</p>
                <p><span className="font-bold text-gray-900">Email:</span> {selectedUser.email}</p>
                <p><span className="font-bold text-gray-900">Địa chỉ:</span> {selectedUser.address || 'Chưa cập nhật'}</p>
                
                <div className="pt-4 border-t">
                    <p className="font-bold text-gray-900 mb-3">Giấy phép lái xe:</p>
                    {selectedUser.driverLicense ? (
                        <img 
                            src={selectedUser.driverLicense} 
                            alt="GPLX" 
                            className="w-full h-56 object-cover rounded-xl border border-gray-200 shadow-sm"
                        />
                    ) : (
                        <div className="w-full h-40 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 italic">
                            Chưa có ảnh GPLX
                        </div>
                    )}
                </div>
            </div>

            {/* PHẦN LỊCH SỬ THUÊ XE CÓ SCROLL */}
            <div className="mt-8">
                <p className="font-bold text-gray-900 text-lg mb-4">Lịch sử đặt xe:</p>
                
                {/* Giới hạn chiều cao và thêm scroll */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {userHistory.length > 0 ? userHistory.map((h, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <img src={h.car?.image} className="w-16 h-16 rounded-lg object-cover" />
                            <div>
                                <p className="font-bold text-sm">{h.car?.brand} {h.car?.model}</p>
                                <p className="text-gray-500 text-xs">{h.pickupDate?.split('T')[0]} • {h.status}</p>
                            </div>
                        </div>
                    )) : <p className="text-gray-400 italic text-sm">Chưa có lịch sử thuê.</p>}
                </div>
            </div>

            <button 
                onClick={() => setSelectedUser(null)}
                className="mt-8 w-full py-4 bg-[#115E59] text-white rounded-xl font-bold text-lg hover:bg-[#0D9488] transition-all"
            >
                Đóng
            </button>
        </div>
    </div>
)}
        </div>
    )
}

export default ManageBookings;