import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
import Testimonial from '../components/Testimonial'
import { useAppContext } from '../context/AppContext'
L.Marker.prototype.options.icon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow });

const CarDetails = () => {

  const {id} = useParams()
  const {cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate} = useAppContext()
  const [car, setCar] = useState(null)
  const [carReviews, setCarReviews] = useState([]) 
  // 👈 CHỈ THÊM: State lưu trữ ngày đã bị book
  const [bookedDates, setBookedDates] = useState([]) 
  
  const navigate = useNavigate()
  const currency = import.meta.env.VITE_CURRENCY || 'VND';
  
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [qrCode, setQrCode] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [driveType, setDriveType] = useState('self-drive');
  // 👈 CHỈ THÊM: Hàm logic kiểm tra ngày
  const isDateBooked = (dateStr) => {
    return bookedDates.some(range => {
      const start = new Date(range.start);
      const end = new Date(range.end);
      const check = new Date(dateStr);
      return check >= start && check <= end;
    });
  };

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
    if (method === 'VNPAY') {
      const price = car.pricePerDay * Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24));
      setQrCode(`https://api.vietqr.io/image/970415-0000000000-qRz5vYk.jpg?amount=${price}&addInfo=ThanhToanDonHang${id}`);
    } else {
      setQrCode(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    // 👈 CHỈ THÊM: Kiểm tra trước khi gửi
    if (isDateBooked(pickupDate) || isDateBooked(returnDate)) {
        toast.error("Ngày này đã được đặt, vui lòng chọn ngày khác!");
        return;
    }
    try {
      const {data} = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate,
        paymentMethod, driveType
      })
      if(data.success) {
        toast.success("Đặt xe thành công!")
        navigate('/my-bookings')
      } else {
        toast.error(data.message || "Đặt xe thất bại. Vui lòng thử lại.")
      }
    } catch(error) {
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

  // 👈 CHỈ THÊM: Lấy danh sách ngày đã book từ server
// 👈 ĐOẠN CẦN SỬA TRONG FILE CarDetails.jsx
useEffect(() => {
    const fetchBookedDates = async () => {
        try {
            console.log("Đang gọi API tới:", `/api/bookings/booked-dates/${id}`); 
            
            // SỬA Ở ĐÂY: Phải lưu kết quả vào biến { data }
const { data } = await axios.get(`/api/bookings/test-dates/${id}`);
            
            if (data.success) {
                setBookedDates(data.bookedIntervals);
            }
        } catch (error) { 
            console.error("Lỗi khi fetch ngày đã đặt:", error); 
        }
    };
    
    if (id) {
        fetchBookedDates();
    }
}, [id, axios]);

// 👈 ĐOẠN CẦN SỬA: Sửa tên hàm bị lỗi ở useEffect cuối cùng
useEffect(() => {
    const fetchCarReviews = async () => {
      try {
        const { data } = await axios.get(`/api/review/car/${id}`); 
        if (data.success) {
          setCarReviews(data.reviews || data.data || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải đánh giá của xe này:", error);
      }
    };
    if (id) fetchCarReviews(); // Đã sửa từ fetchBookedReviews thành fetchCarReviews
}, [id, axios]);

useEffect(() => {
    const fetchOwnerDetails = async () => {
      // SỬA Ở ĐÂY: Thêm dấu ? để kiểm tra car có tồn tại trước khi truy cập .owner
      if (car?.owner) { 
        try {
          // Lấy ID chủ xe an toàn
          const ownerId = typeof car.owner === 'object' ? car.owner._id : car.owner;
          
          const { data } = await axios.get(`/api/owner/details/${ownerId}`); 
          
          if (data.success) {
            setOwnerDetails(data.owner);
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin chủ xe:", error);
        }
      }
    };
    fetchOwnerDetails();
  }, [car, axios]); // Sửa dependencies thành [car, axios] để nó chạy lại khi car đã có dữ liệu

  console.log("Dữ liệu xe hiện tại:", car);
  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 font-bevietnam antialiased'>

    <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-400 hover:text-[#0D9488] transition-colors font-medium cursor-pointer text-sm'>
        <img src={assets.arrow_icon} alt="Quay lại" className='rotate-180 opacity-60 w-4 h-4'/>
        Quay lại danh sách xe
    </button>

    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16'>
    <motion.div 
    initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:0.6, ease: "easeOut"}}
    className='lg:col-span-2'>
        <img src={car.image} alt={`${car.brand} ${car.model}`} className='w-full h-auto md:max-h-100 object-cover rounded-2xl mb-6 shadow-md border border-gray-100'/>
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-mplus font-extrabold text-gray-900 tracking-tight'>{car.brand} {car.model}</h1>
                <p className='text-gray-400 text-sm md:text-base mt-1 font-medium'>
                    {car.category} <span className="mx-1.5">•</span> Năm sản xuất <span className="font-mplus font-bold text-gray-600">{car.year}</span>
                </p>
            </div>
            
            <hr className='border-borderColor my-6' />
            
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            {[
              {icon: assets.users_icon, text: `${car.seating_capacity} Chỗ ngồi`},
              {icon: assets.fuel_icon, text: car.fuel_type},
              {icon: assets.car_icon, text: car.transmission === 'Automatic' ? 'Số tự động' : 'Số sàn'},
              {icon: assets.location_icon, text: car.location},
            ].map(({icon, text})=>(
              <div key={text} className='flex flex-col items-center bg-gray-50/80 border border-gray-100/50 p-4 rounded-xl text-xs md:text-sm font-bold text-gray-700 shadow-sm'>
                <img src={icon} alt="Icon" className='h-5 mb-2.5 opacity-80' />
                <span>{text}</span>
              </div>
            ))}
            </div>
            
            <div className="bg-white rounded-xl border border-borderColor/60 p-5 shadow-sm">
              <h2 className='text-base font-bold text-gray-900 mb-3 border-l-4 border-[#115E59] pl-2.5'>Mô tả chi tiết</h2>
              <p className='text-gray-500 text-sm leading-relaxed font-medium'>{car.description}</p>
            </div>

            <div className="bg-white rounded-xl border border-borderColor/60 p-5 shadow-sm">
              <h2 className='text-base font-bold text-gray-900 mb-3 border-l-4 border-[#115E59] pl-2.5'>Vị trí xe</h2>
              <div className="h-64 w-full rounded-lg overflow-hidden border">
                <MapContainer center={[car.lat || 10.0452, car.lng || 105.7469]} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[car.lat || 10.0452, car.lng || 105.7469]} />
                </MapContainer>
              </div>
            </div>
        </div>
    </motion.div>

      <motion.form 
      onSubmit={handleSubmit} className='shadow-xl h-max sticky top-24 rounded-2xl p-6 space-y-5 text-gray-500 bg-white border border-borderColor/60'>

        <div className='flex items-baseline justify-between'>
          <p className='text-3xl font-mplus font-extrabold text-[#115E59] tracking-tight'>
            {Number(car.pricePerDay).toLocaleString()} <span className="text-sm font-bevietnam font-bold opacity-80">{currency}</span>
          </p>
          <span className='text-xs text-gray-400 font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-0.5 rounded'>/ Ngày</span>
        </div>

        <hr className='border-borderColor my-4'/>
            {/* Phần chọn hình thức lái */}
<div className="space-y-3 pt-2">
    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Hình thức thuê</p>
    <div className="flex gap-4">
        {car.driveTypes.includes('self-drive') && (
            <button 
                type="button" 
                onClick={() => setDriveType('self-drive')} 
                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${driveType === 'self-drive' ? 'border-[#115E59] bg-teal-50 text-[#115E59]' : 'border-gray-200'}`}
            >
                🚗 Tự lái
            </button>
        )}
        {car.driveTypes.includes('with-driver') && (
            <button 
                type="button" 
                onClick={() => setDriveType('with-driver')} 
                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${driveType === 'with-driver' ? 'border-[#115E59] bg-teal-50 text-[#115E59]' : 'border-gray-200'}`}
            >
                👤 Có tài xế
            </button>
        )}
    </div>
</div>
        <div className='flex flex-col gap-1.5'>
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Ngày nhận xe</label>
          <input 
            value={pickupDate} 
            onChange={(e) => setPickupDate(e.target.value)} 
            type="date" 
            className={`border px-3 py-2 rounded-xl text-sm outline-none ${isDateBooked(pickupDate) ? 'border-red-500 text-red-600' : 'border-borderColor'}`} 
            required 
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className='flex flex-col gap-1.5'>
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Ngày trả xe</label>
          <input 
            value={returnDate} 
            onChange={(e) => setReturnDate(e.target.value)} 
            type="date" 
            className={`border px-3 py-2 rounded-xl text-sm outline-none ${isDateBooked(returnDate) ? 'border-red-500 text-red-600' : 'border-borderColor'}`} 
            required 
            min={pickupDate || new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Phương thức thanh toán</p>
            <div className="flex gap-4">
                <button type="button" onClick={() => handlePaymentSelection('Cash')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${paymentMethod === 'Cash' ? 'border-[#115E59] bg-teal-50 text-[#115E59]' : 'border-gray-200'}`}>Tiền mặt</button>
                <button type="button" onClick={() => handlePaymentSelection('VNPAY')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${paymentMethod === 'VNPAY' ? 'border-[#115E59] bg-teal-50 text-[#115E59]' : 'border-gray-200'}`}>VNPAY QR</button>
            </div>
        </div>

        {qrCode && (
            <div className="flex flex-col items-center p-4 border border-dashed border-[#115E59] rounded-xl bg-gray-50">
                <img src={qrCode} alt="QR Code" className="w-32 h-32 mb-2"/>
                <p className="text-[10px] text-[#115E59] font-bold text-center">Quét mã để thanh toán ngay</p>
            </div>
        )}

        <button className='w-full bg-[#115E59] hover:bg-[#0D9488] transition-all duration-300 py-3.5 font-bold text-sm text-white rounded-xl uppercase tracking-wider cursor-pointer shadow-lg mt-2'>
          Đặt xe ngay
        </button>
{/* Thông tin chủ xe */}
<div className="bg-white rounded-xl border border-borderColor/60 p-5 shadow-sm mt-4">
  <h2 className='text-base font-bold text-gray-900 mb-4 border-l-4 border-[#115E59] pl-2.5'>Thông tin chủ xe</h2>
  
  <div className='flex items-center gap-4'>
    {/* Avatar thông minh: hiển thị ảnh hoặc chữ cái đầu */}
    <div className='w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-[#115E59] font-bold text-xl overflow-hidden border border-teal-200 shadow-sm shrink-0'>
      {ownerDetails?.image ? (
        <img 
          src={ownerDetails.image} 
          alt={ownerDetails.name || "Avatar"} 
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{ownerDetails?.name?.[0]?.toUpperCase() || 'O'}</span>
      )}
    </div>

    {/* Thông tin chi tiết */}
    <div className='flex-1'>
      <p className='font-bold text-gray-900 text-base'>
        {ownerDetails?.name || "Đang tải..."}
      </p>
      <p className='text-sm text-gray-500 mt-0.5'>
        <span className='mr-2'>📞</span> {ownerDetails?.phone || "Chưa cập nhật SĐT"}
      </p>
      <p className='text-sm text-gray-500'>
        <span className='mr-2'>📧</span> {ownerDetails?.email || "Chưa cập nhật Email"}
      </p>
    </div>
  </div>
</div>
      </motion.form>
    </div>
        
    <div className="border-t border-gray-100 mt-10">
        <Testimonial reviews={carReviews} />
    </div>

 </div>
 
  ) : <Loader/>;
}

export default CarDetails;