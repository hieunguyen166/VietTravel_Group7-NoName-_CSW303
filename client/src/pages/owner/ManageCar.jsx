import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';

const ManageCars = () => {

    const { isOwner, currency } = useAppContext()
    const [cars, setCars] = useState([])

    // Ép kiểu kiểm tra mọi tình huống: Kiểm tra cả true dạng boolean và "true" dạng chuỗi chữ kí tự
const isCarReady = cars.isAvailable === true ||
                String(cars.isAvailable).toLowerCase() === 'true' ||
                cars.isAvaliable === true ||
                String(cars.isAvaliable).toLowerCase() === 'true';

    const fetchOwnerCars = async () => {
        try {
            // FIX 1: Đổi đúng endpoint API lấy danh sách xe thay vì lấy dữ liệu dashboard
            const { data } = await axios.get('/api/owner/cars')
            if (data.success){
                setCars(data.cars || [])
                console.log("DỮ LIỆU XE THỰC TẾ TỪ DB:", data.cars)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const toggleAvailability = async (carId) => {
    try {
        // Gửi cả object chứa carId một cách tường minh nhất
        const { data } = await axios.post('/api/owner/toggle-car', { carId: carId })
        
        if (data.success){
            toast.success(data.message)
            // Đợi 100ms để DB cập nhật xong rồi mới pull dữ liệu mới về gán vào state
            setTimeout(() => {
                fetchOwnerCars()
            }, 100)
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.message)
    }
}

    const deleteCar = async (carId) => {
        try {
            const confirm = window.confirm("Bạn có chắc chắn muốn xóa phương tiện này? Hành động này không thể hoàn tác.")
            if (!confirm) return;

            const { data } = await axios.post('/api/owner/delete-car', { carId })
            if (data.success){
                toast.success(data.message)
                fetchOwnerCars() // Làm mới danh sách sau khi xóa
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (isOwner) {
            fetchOwnerCars()
        }
    }, [isOwner])

    return (
        <div className='px-4 pt-10 md:px-10 w-full font-bevietnam antialiased'>
            <Title title="Quản Lý Danh Sách Xe" subTitle="Xem toàn bộ danh sách xe bạn đang sở hữu, cập nhật thông tin chi tiết hoặc tạm ẩn khỏi nền tảng đặt xe." />
            
            <div className='max-w-4xl w-full rounded-xl overflow-hidden border border-borderColor mt-6 bg-white shadow-sm'>
                <table className='w-full border-collapse text-left text-sm text-gray-600'>
                    <thead className='text-gray-400 bg-gray-50/70 text-xs uppercase tracking-wider border-b border-borderColor'>
                        <tr>
                            <th className="p-3.5 font-bold">Phương tiện</th>
                            <th className="p-3.5 font-bold max-md:hidden">Phân khúc</th>
                            <th className="p-3.5 font-bold">Giá thuê</th>
                            <th className="p-3.5 font-bold max-md:hidden">Trạng thái</th>
                            <th className="p-3.5 font-bold text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars && cars.length > 0 ? (
                            cars.map((car, index) => (
                                <tr key={index} className='border-t border-borderColor hover:bg-gray-50/40 transition-colors'>
                                    
                                    {/* Cột xe và thông số đi kèm */}
                                    <td className='p-3.5 flex items-center gap-3'>
                                        <img src={car.image} alt="Car" className="h-12 w-12 aspect-square rounded-lg object-cover border border-gray-100 shrink-0" />
                                        <div>
                                            <p className='font-bold text-gray-800 text-sm'>{car.brand} {car.model}</p>
                                            <p className='text-xs text-gray-400 mt-0.5 font-medium'>
                                                <span className="font-mplus">{car.seating_capacity}</span> chỗ • {car.transmission === 'Automatic' ? 'Số tự động' : 'Số sàn'}
                                            </p>
                                            <span className="inline-block md:hidden mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold uppercase">
                                                {car.category}
                                            </span>
                                        </div>
                                    </td>
                                    
                                    {/* Cột Phân khúc xe (Desktop) */}
                                    <td className='p-3.5 max-md:hidden font-medium text-gray-500'>{car.category}</td>
                                    
                                    {/* Cột Giá thuê ngày */}
                                    <td className='p-3.5 font-mplus font-bold text-gray-700 whitespace-nowrap'>
                                        {Number(car.pricePerDay || 0).toLocaleString()} {currency} <span className="text-xs font-bevietnam font-medium text-gray-400">/ ngày</span>
                                    </td>
                                    
                                    {/* Cột Trạng thái khả dụng - FIX 2: Sửa car.isAvaliable sang đúng car.isAvailable */}
                                    <td className='p-3.5 max-md:hidden'>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide border ${
                                            car.isAvailable 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                : 'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>
                                            {car.isAvailable ? "Đang trống" : "Đã khóa"}
                                        </span>
                                    </td>

                                    {/* Cột nút Hành động điều khiển xe */}
                                    <td className='p-3.5'>
                                        <div className='flex items-center justify-center gap-4'>
                                            {/* FIX 3: Sửa icon hiển thị dựa trên car.isAvailable */}
                                            <img onClick={() => toggleAvailability(car._id)}
                                                src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon} 
                                                alt="Toggle Visibility" 
                                                className='w-15 h-15 cursor-pointer opacity-60 hover:opacity-100 transition-all p-0.5' 
                                                title={car.isAvailable ? "Tạm ẩn xe" : "Hiện xe công khai"}
                                            />
                                            <img onClick={() => deleteCar(car._id)}
                                                src={assets.delete_icon} 
                                                alt="Delete" 
                                                className='w-15 h-15 cursor-pointer opacity-60 hover:opacity-100 hover:scale-110 transition-all p-0.5' 
                                                title="Xóa phương tiện"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-8 text-gray-400 font-medium">
                                    Bạn chưa có phương tiện nào được niêm yết.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageCars;