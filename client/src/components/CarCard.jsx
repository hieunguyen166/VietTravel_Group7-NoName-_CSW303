import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const CarCard = ({ car }) => {

    const currency = import.meta.env.VITE_CURRENCY || 'VND';
    const navigate = useNavigate();

    // Giữ nguyên 100% logic kiểm tra trạng thái rảnh của xe
    const isCarAvailable = 
        car.isAvailable === true || car.isAvailable === 'true' || 
        car.available === true || car.available === 'true' ||
        car.availability === true || car.status === 1 ||
        (car.isAvailable === undefined && car.available === undefined);

    return (
        <div 
            onClick={() => { navigate(`/car-details/${car._id}`); window.scrollTo(0, 0); }}
            className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 bg-white border border-gray-100 cursor-pointer antialiased'
        >
            {/* HÌNH ẢNH XE & TAG TRẠNG THÁI */}
            <div className='relative h-48 overflow-hidden bg-gray-50'>
                <img 
                    src={car.image} 
                    alt={`${car.brand} ${car.model}`} 
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
            
                {isCarAvailable && (
                    <span className='absolute top-4 left-4 bg-[#115E59] text-white text-[11px] font-bevietnam font-bold px-2.5 py-1.5 rounded-full shadow-lg z-10 uppercase tracking-wider select-none pointer-events-none'>
                        Sẵn sàng ngay
                    </span>
                )}
            
                {/* GIÁ TIỀN: Sử dụng font-mplus font-bold đan xen font-bevietnam tạo điểm nhấn số liệu sắc nét */}
                <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-lg z-10 select-none flex items-center gap-1'>
                    <span className='font-mplus font-bold text-sm tracking-tight'>{Number(car.pricePerDay).toLocaleString()} {currency}</span>
                    <span className='font-bevietnam text-xs text-white/80 font-medium'>/ ngày</span>
                </div>
            </div>

            {/* NỘI DUNG THÔNG TIN CHI TIẾT */}
            <div className='p-5 sm:p-6'>
                <div className='flex justify-between items-start mb-3'>
                    <div>
                        {/* TIÊU ĐỀ XE: Dùng font-mplus font-extrabold (Weight 800) tạo khối chữ thương hiệu rất sang và chắc chắn */}
                        <h3 className='text-lg sm:text-xl font-mplus font-extrabold tracking-tight text-gray-900 transition-colors group-hover:text-[#115E59]'>
                            {car.brand} {car.model}
                        </h3>
                        
                        {/* PHÂN KHÚC & NĂM SẢN XUẤT: Số năm sản xuất đưa về font-mplus trực quan */}
                        <p className='text-gray-400 text-xs sm:text-sm font-medium font-bevietnam mt-0.5 tracking-wide'>
                            {car.category} • <span className='font-mplus font-semibold text-xs'>{car.year}</span>
                        </p>
                    </div>
                </div>

                {/* 4 Ô THÔNG SỐ ĐƯỢC CHUẨN HÓA FONT */}
                <div className='mt-5 grid grid-cols-2 gap-x-4 gap-y-3.5 pt-4 border-t border-gray-100'>
                    
                    {/* Ô 1: Ghế ngồi */}
                    <div className='flex items-center text-[13px] md:text-[14px] font-semibold font-bevietnam text-gray-700 bg-gray-50/60 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-gray-100 transition-colors'>
                        <img src={assets.users_icon} alt="Số ghế" className='h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-2.5 opacity-85 object-contain'/>
                        <span className='truncate'>
                            <span className='font-mplus font-bold text-[14px] md:text-[15px] mr-0.5'>{car.seating_capacity || car.seats || '4'}</span> Ghế
                        </span>
                    </div>

                    {/* Ô 2: Nhiên liệu */}
                    <div className='flex items-center text-[13px] md:text-[14px] font-semibold font-bevietnam text-gray-700 bg-gray-50/60 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-gray-100 transition-colors'>
                        <img src={assets.fuel_icon} alt="Nhiên liệu" className='h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-2.5 opacity-85 object-contain'/>
                        <span className='truncate'>
                            {car.fuel_type === 'Petrol' || car.fuel === 'Petrol' ? 'Xăng' : (car.fuel_type || car.fuel || 'Xăng')}
                        </span>
                    </div>

                    {/* Ô 3: Hộp số */}
                    <div className='flex items-center text-[13px] md:text-[14px] font-semibold font-bevietnam text-gray-700 bg-gray-50/60 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-gray-100 transition-colors'>
                        <img src={assets.car_icon} alt="Hộp số" className='h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-2.5 opacity-85 object-contain'/>
                        <span className='truncate'>
                            {car.transmission === 'Automatic' ? 'Tự động' : car.transmission === 'Manual' ? 'Số sàn' : (car.transmission || 'Tự động')}
                        </span>
                    </div>

                    {/* Ô 4: Địa điểm */}
                    <div className='flex items-center text-[13px] md:text-[14px] font-semibold font-bevietnam text-gray-700 bg-gray-50/60 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-gray-100 transition-colors'>
                        <img src={assets.location_icon} alt="Địa điểm" className='h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-2.5 opacity-85 object-contain'/>
                        <span className='truncate tracking-tight'>{car.location || 'Việt Nam'}</span>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CarCard;