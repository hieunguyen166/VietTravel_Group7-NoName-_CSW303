import { motion } from "motion/react";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";

const Cars = () => {

  // Lấy các tham số tìm kiếm từ URL
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get('pickupLocation');
  const pickupDate = searchParams.get('pickupDate');
  const returnDate = searchParams.get('returnDate');
  
  // ✅ ĐÃ THÊM: Lấy tham số driveType từ URL (nếu khách bấm tìm từ trang chủ)
  const initialDriveType = searchParams.get('driveType') || 'all';

  const { cars, axios } = useAppContext();

  const [input, setInput] = useState('');
  
  // ✅ ĐÃ THÊM: State quản lý tab phân loại xe (Tất cả / Tự lái / Có tài xế)
  const [driveTypeFilter, setDriveTypeFilter] = useState(initialDriveType);

  const [filteredCars, setFilteredCars] = useState([]);
  
  // State lưu trữ danh sách xe gốc (phục vụ cho cả luồng tìm kiếm theo ngày và luồng load mặc định)
  const [baseCars, setBaseCars] = useState([]);

  /* LOGIC LỌC XE THỜI GIAN THỰC ĐA ĐIỀU KIỆN */
  /* LOGIC LỌC XE THỜI GIAN THỰC ĐA ĐIỀU KIỆN */
const applyFillter = () => {
    let result = baseCars.slice();

    // 1. Lọc theo hình thức lái xe (Tab) - SỬA Ở ĐÂY
    if (driveTypeFilter !== 'all') {
        // Kiểm tra xem mảng driveTypes có chứa loại hình được chọn không
        result = result.filter(car => 
            car.driveTypes && car.driveTypes.includes(driveTypeFilter)
        );
    }

    // 2. Lọc theo từ khóa text
    if (input.trim() !== '') {
        const searchKey = input.toLowerCase().trim();
        result = result.filter((car) => {
            return (
                (car.brand && car.brand.toLowerCase().includes(searchKey)) ||
                (car.model && car.model.toLowerCase().includes(searchKey)) ||
                (car.category && car.category.toLowerCase().includes(searchKey)) ||
                (car.transmission && car.transmission.toLowerCase().includes(searchKey)) ||
                (car.fuel_type && car.fuel_type.toLowerCase().includes(searchKey)) ||
                (car.seating_capacity && car.seating_capacity.toString().includes(searchKey)) ||
                (car.year && car.year.toString().includes(searchKey)) ||
                (car.pricePerDay && car.pricePerDay.toString().includes(searchKey)) ||
                (car.location && car.location.toLowerCase().includes(searchKey)) ||
                (car.city && car.city.toLowerCase().includes(searchKey))
            );
        });
    }

    setFilteredCars(result);
};

  const isSearchData = pickupLocation && pickupDate && returnDate;
  
  const searchCarAvailability = async () => {
    try {
      const { data } = await axios.post('/api/bookings/check-availability', {
        location: pickupLocation,
        pickupDate,
        returnDate
      });
      if (data.success) {
        setBaseCars(data.availableCars); // Lưu vào base thay vì filteredCars để bộ lọc hoạt động tiếp
        if (data.availableCars.length === 0) {
          toast('Rất tiếc, không có xe nào phù hợp với yêu cầu của bạn.', { type: 'error' });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Khởi tạo dữ liệu gốc khi load trang
  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability();
    } else {
      setBaseCars(cars);
    }
  }, [cars]);

  // Kích hoạt bộ lọc mỗi khi danh sách gốc, text tìm kiếm, hoặc Tab thay đổi
  useEffect(() => {
    applyFillter();
  }, [baseCars, input, driveTypeFilter]);

  return (
    <div className="font-bevietnam antialiased min-h-screen bg-white">
      
      {/* Khu vực thanh tìm kiếm (Hero Search) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className='flex flex-col items-center py-20 bg-light max-md:px-4'
      >
        <Title title='Danh Sách Xe Sẵn Sàng' subTitle='Khám phá bộ sưu tập xe đa dạng của chúng tôi đang sẵn sàng phục vụ hành trình của bạn' />

        {/* Khung tìm kiếm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className='flex items-center bg-white px-4 mt-8 max-w-[560px] w-full h-12 rounded-full shadow-md border border-transparent focus-within:border-[#115E59] transition-all duration-300'
        >
          <img src={assets.search_icon} alt="Search" className='w-4.5 h-4.5 mr-3 opacity-60' />
          
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder='Tìm kiếm theo hãng xe, dòng xe hoặc phân khúc...'
            className='w-full h-full outline-none text-gray-700 font-medium text-sm placeholder-gray-400'
          />
          
          <img src={assets.filter_icon} alt="Filter" className='w-4.5 h-4.5 ml-2 opacity-60 cursor-pointer hover:opacity-100 transition-opacity' />
        </motion.div>

        {/* ✅ ĐÃ THÊM: Khu vực Tabs lọc loại hình lái xe */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="flex items-center justify-center gap-3 mt-6"
        >
          <button
            onClick={() => setDriveTypeFilter('all')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${driveTypeFilter === 'all' ? 'bg-[#115E59] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setDriveTypeFilter('self-drive')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${driveTypeFilter === 'self-drive' ? 'bg-[#115E59] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            Xe tự lái
          </button>
          <button
            onClick={() => setDriveTypeFilter('with-driver')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${driveTypeFilter === 'with-driver' ? 'bg-[#115E59] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            Xe có tài xế
          </button>
        </motion.div>
      </motion.div>
      
      {/* Khu vực hiển thị danh sách xe */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        className='px-6 md:px-16 lg:px-24 xl:px-32 mt-12 pb-20'
      >
        <p className="text-gray-400 xl:px-5 max-w-7xl mx-auto text-sm font-semibold uppercase tracking-wider">
          Hiển thị <span className="font-mplus font-extrabold text-[#115E59] text-base mx-0.5">{filteredCars.length}</span> phương tiện
        </p>
        
        {filteredCars.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 max-w-7xl mx-auto'>
            {filteredCars.map((car, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4, ease: "easeOut" }}
                key={car._id || index} 
                className="hover:-translate-y-1 transition-transform duration-300"
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 max-w-7xl mx-auto bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 mt-6">
            <p className="text-gray-400 font-medium text-base">Không tìm thấy chiếc xe nào phù hợp với từ khóa và bộ lọc của bạn.</p>
            <button 
              onClick={() => { setInput(''); setDriveTypeFilter('all'); }} 
              className="mt-4 text-xs font-bold text-[#0D9488] hover:text-[#115E59] underline cursor-pointer"
            >
              Xóa bộ lọc tìm kiếm
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Cars;