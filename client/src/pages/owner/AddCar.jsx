import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { assets, cityList } from '../../assets/assets'; // 🛠️ Đã thêm import cityList ở đây
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';

// 🛠️ IMPORT LEAFLET
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
L.Marker.prototype.options.icon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow });

const LocationPicker = ({ car, setCar }) => {
  useMapEvents({
    click(e) {
      setCar({ ...car, lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return car.lat ? <Marker position={[car.lat, car.lng]} /> : null;
};

const AddCar = () => {
  const { axios, currency } = useAppContext();
  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: '', model: '', year: 0, pricePerDay: 0, category: '', 
    transmission: '', fuel_type: '', seating_capacity: 0, location: '', 
    city: '', // Điểm lưu dữ liệu Tỉnh/Thành phố
    lat: 0, lng: 0, description: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if(isLoading) return null;
    if(car.city === '') { toast.error("Vui lòng chọn Tỉnh/Thành phố!"); return; }
    if(car.lat === 0 || car.lng === 0) { toast.error("Vui lòng nhấp chọn vị trí trên bản đồ!"); return; }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('carData', JSON.stringify(car));
      const { data } = await axios.post('/api/owner/add-car', formData);
      if(data.success){
          toast.success(data.message);
          setImage(null);
          setCar({ brand: '', model: '', year: 0, pricePerDay: 0, category: '', transmission: '', fuel_type: '', seating_capacity: 0, location: '', city: '', lat: 0, lng: 0, description: '' });
      } else {
          toast.error(data.message);
      }
    } catch (error) { toast.error(error.message); }
    finally { setIsLoading(false); }
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1 font-bevietnam antialiased'>
      <Title title="Thêm Xe Mới" subTitle="Điền đầy đủ thông tin chi tiết để đăng ký niêm yết xe mới lên hệ thống, bao gồm giá thuê, thông số kỹ thuật và khu vực vận hành." />
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-600 text-sm mt-6 max-w-xl'>
        
        {/* Tải ảnh xe */}
        <div className='flex items-center gap-3 w-full border border-dashed border-gray-200 p-4 rounded-xl bg-gray-50/50'>
            <label htmlFor="car-image" className="shrink-0">
                <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="Upload" className='h-16 w-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-gray-200 bg-white'/>
                <input type="file" id="car-image" accept="image/*" hidden onChange={e => setImage(e.target.files[0])}/>
            </label>
            <p className='text-xs md:text-sm text-gray-400 font-medium'>Tải lên hình ảnh thực tế của xe (Định dạng JPG, PNG)</p>
        </div>

        {/* Hãng xe & Dòng xe */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label className="font-bold text-gray-800 mb-1.5">Hãng xe</label>
            <input type="text" placeholder="Ví dụ: BMW, Mercedes..." required className='px-3 py-2 border border-borderColor rounded-md outline-none text-gray-900 font-medium' value={car.brand} onChange={e => setCar({...car, brand: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label className="font-bold text-gray-800 mb-1.5">Dòng xe (Model)</label>
            <input type="text" placeholder="Ví dụ: X5, E-Class..." required className='px-3 py-2 border border-borderColor rounded-md outline-none text-gray-900 font-medium' value={car.model} onChange={e => setCar({...car, model: e.target.value})}/>
          </div>
        </div>

        {/* Năm sản xuất & Giá thuê & Phân khúc */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label className="font-bold text-gray-800 mb-1.5">Năm sản xuất</label>
            <input type="number" placeholder="2026" required className='px-3 py-2 border border-borderColor rounded-md outline-none text-gray-900 font-bold' value={car.year || ''} onChange={e => setCar({...car, year: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label className="font-bold text-gray-800 mb-1.5">Giá thuê / Ngày ({currency})</label>
            <input type="number" placeholder="500000" required className='px-3 py-2 border border-borderColor rounded-md outline-none text-gray-900 font-bold' value={car.pricePerDay || ''} onChange={e => setCar({...car, pricePerDay: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label className="font-bold text-gray-800 mb-1.5">Phân khúc xe</label>
              <select onChange={e => setCar({...car, category: e.target.value})} value={car.category} className='px-3 py-2 border border-borderColor rounded-md outline-none bg-white text-gray-900 font-medium'>
                <option value="">Chọn phân khúc</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Van">Van</option>
              </select>
          </div>
        </div>

        {/* Hộp số, Loại nhiên liệu & Số chỗ ngồi */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label className="font-bold text-gray-800 mb-1.5">Hộp số</label>
            <select onChange={e => setCar({...car, transmission: e.target.value})} value={car.transmission} className='px-3 py-2 border border-borderColor rounded-md outline-none bg-white text-gray-900 font-medium'>
              <option value="">Chọn hộp số</option>
              <option value="Số tự động">Số tự động</option>
              <option value="Số sàn">Số sàn</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label className="font-bold text-gray-800 mb-1.5">Loại nhiên liệu</label>
            <select onChange={e => setCar({...car, fuel_type: e.target.value})} value={car.fuel_type} className='px-3 py-2 border border-borderColor rounded-md outline-none bg-white text-gray-900 font-medium'>
              <option value="">Chọn nhiên liệu</option>
              <option value="Diesel">Dầu Diesel</option>
              <option value="Xăng">Xăng</option>
              <option value="Điện">Điện</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label className="font-bold text-gray-800 mb-1.5">Số chỗ ngồi</label>
            <input type="number" placeholder="4" required className='px-3 py-2 border border-borderColor rounded-md outline-none text-gray-900 font-bold' value={car.seating_capacity || ''} onChange={e => setCar({...car, seating_capacity: e.target.value})}/>
          </div>
        </div>

        {/* 🛠️ LOCATION: Nhập tay + Chọn Tỉnh/Thành + Chọn bản đồ */}
        <div className='flex flex-col w-full gap-3'>
          <label className="font-bold text-gray-800">Địa chỉ & Vị trí trên bản đồ</label>
          
          {/* Ô chọn Tỉnh/Thành phố đổ dữ liệu tự động từ cityList */}
          <select 
            value={car.city}
            onChange={e => setCar({...car, city: e.target.value})} 
            required
            className='px-3 py-2 border border-borderColor rounded-md outline-none bg-white text-gray-900 font-medium'
          >
            <option value="">-- Chọn Tỉnh/Thành phố --</option>
            {cityList && cityList.map((cityName, index) => (
              <option key={index} value={cityName}>{cityName}</option>
            ))}
          </select>

          {/* Ô nhập địa chỉ chi tiết */}
          <input 
            type="text" 
            placeholder="Nhập địa chỉ chi tiết (VD: 123 Đường 3/2, Q. Ninh Kiều...)" 
            required 
            className='px-3 py-2 border border-borderColor rounded-md outline-none text-gray-900 font-medium' 
            value={car.location} 
            onChange={e => setCar({...car, location: e.target.value})}
          />
          
          {/* Bản đồ Leaflet */}
          <div className="h-64 w-full border rounded-lg overflow-hidden">
            <MapContainer center={[10.0452, 105.7469]} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker car={car} setCar={setCar} />
            </MapContainer>
          </div>
          <p className="text-xs text-teal-700 font-medium italic">Vui lòng nhấp vào vị trí của xe trên bản đồ để xác định tọa độ.</p>
        </div>

        {/* Mô tả chi tiết */}
        <div className='flex flex-col w-full'>
          <label className="font-bold text-gray-800 mb-1.5">Mô tả chi tiết</label>
          <textarea rows={5} placeholder="Mô tả..." required className='px-3 py-2 border border-borderColor rounded-md outline-none text-gray-900 font-medium' value={car.description} onChange={e => setCar({...car, description: e.target.value})}></textarea>
        </div>

        {/* NÚT SUBMIT */}
        <button className='flex items-center justify-center gap-2 px-6 py-3 mt-4 bg-[#115E59] hover:bg-[#0D9488] text-white rounded-xl font-bold uppercase cursor-pointer w-full sm:w-max'>
          {isLoading ? 'Đang xử lý...' : 'Xác nhận đăng ký xe'}
        </button>
      </form>
    </div>
  )
}
export default AddCar;