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



  // getting search parameters from URL query string

  const [searchParams] = useSearchParams();

  const pickupLocation = searchParams.get('pickupLocation');

  const pickupDate = searchParams.get('pickupDate');

  const returnDate = searchParams.get('returnDate');



  const {cars, axios} = useAppContext();



  const [input, setInput] = useState('');



  /* LOGIC LỌC XE THỜI GIAN THỰC: Tìm kiếm không phân biệt hoa thường theo Hãng xe, Dòng xe hoặc Phân khúc */

  const [filteredCars, setFilteredCars] = useState([]);



  /* LOGIC LỌC XE THỜI GIAN THỰC: Đối chiếu trực tiếp chuỗi Tiếng Việt từ Database */

  const applyFillter = async ()=>{

    if(input.trim() === ''){

      setFilteredCars(cars);

      return null;

    }



    const filtered = cars.slice().filter((car) => {

      const searchKey = input.toLowerCase().trim();

     

      return (

        (car.brand && car.brand.toLowerCase().includes(searchKey)) ||

        (car.model && car.model.toLowerCase().includes(searchKey)) ||

        (car.category && car.category.toLowerCase().includes(searchKey)) ||

        (car.transmission && car.transmission.toLowerCase().includes(searchKey)) ||

        (car.fuel_type && car.fuel_type.toLowerCase().includes(searchKey)) ||

        (car.seating_capacity && car.seating_capacity.toString().includes(searchKey)) ||

        (car.year && car.year.toString().includes(searchKey)) ||

        (car.pricePerDay && car.pricePerDay.toString().includes(searchKey)) ||

        (car.location && car.location.toLowerCase().includes(searchKey))

      );

    });

    setFilteredCars(filtered);

  };



  const isSearchData = pickupLocation && pickupDate && returnDate;

  const searchCarAvailability = async () => {

      // 🛠️ SỬA LỖI: Bọc các tham số tìm kiếm vào trong thuộc tính "params" để Axios gửi đúng định dạng URL request

      const {data} = await axios.post('/api/bookings/check-availability', {

        location: pickupLocation,

        pickupDate,

        returnDate

      }, {

      });

      if(data.success) {

        setFilteredCars(data.availableCars);

        if(data.availableCars.length === 0) {

          toast('Rất tiếc, không có xe nào phù hợp với yêu cầu của bạn. Vui lòng thử lại với các tiêu chí khác.', { type: 'error' });

        }

      }

      return null;

    };



    useEffect(() => {

      isSearchData && searchCarAvailability();

    }, []);



    useEffect(() => {

      cars.length > 0 && !isSearchData && applyFillter();

    },[input, cars]);



  return (

    /* Áp dụng font-bevietnam tạo không gian tìm kiếm thanh lịch, hiện đại */

    <div className="font-bevietnam antialiased min-h-screen bg-white">

     

      {/* Khu vực thanh tìm kiếm (Hero Search) */}

      <motion.div

      initial={{opacity:0, y:30}}

      whileInView={{opacity:1, y:0}}

      transition={{duration:0.6, ease: "easeOut"}}

      className='flex flex-col items-center py-20 bg-light max-md:px-4'>

        {/* VIỆT HÓA HOÀN TOÀN TIÊU ĐỀ TRANG */}

        <Title title='Danh Sách Xe Sẵn Sàng' subTitle='Khám phá bộ sưu tập xe đa dạng của chúng tôi đang sẵn sàng phục vụ hành trình của bạn' />



        {/* Khung tìm kiếm: Tích hợp focus border màu thương hiệu #115E59 */}

        {/* 🛠️ SỬA LỖI: Thay thế class lỗi max-w-140 sang class chuẩn max-w-[560px] */}

        <motion.div

        initial={{opacity:0, y:20}}

        whileInView={{opacity:1, y:0}}

        transition={{duration:0.3, delay:0.5}}

        className='flex items-center bg-white px-4 mt-8 max-w-[560px] w-full h-12 rounded-full shadow-md border border-transparent focus-within:border-[#115E59] transition-all duration-300'>

          <img src={assets.search_icon} alt="Search" className='w-4.5 h-4.5 mr-3 opacity-60'/>

         

          {/* Việt hóa Placeholder hướng dẫn tìm kiếm */}

          <input

            onChange={(e) => setInput(e.target.value)}

            value={input}

            type="text"

            placeholder='Tìm kiếm theo hãng xe, dòng xe hoặc phân khúc...'

            className='w-full h-full outline-none text-gray-700 font-medium text-sm placeholder-gray-400'

          />

         

          <img src={assets.filter_icon} alt="Filter" className='w-4.5 h-4.5 ml-2 opacity-60 cursor-pointer hover:opacity-100 transition-opacity'/>

        </motion.div>

      </motion.div>

     

      {/* Khu vực hiển thị danh sách xe */}

      <motion.div

      initial={{opacity:0}}

      whileInView={{opacity:1}}

      transition={{delay:0.5, duration:0.6, ease: "easeOut"}}

      className='px-6 md:px-16 lg:px-24 xl:px-32 mt-12 pb-20'>

        {/* Số lượng xe tìm thấy: Áp dụng font-mplus font-bold cho con số hiển thị sinh động */}

        <p className="text-gray-400 xl:px-5 max-w-7xl mx-auto text-sm font-semibold uppercase tracking-wider">

          Hiển thị <span className="font-mplus font-extrabold text-[#115E59] text-base mx-0.5">{filteredCars.length}</span> phương tiện

        </p>

       

        {/* Lưới danh sách xe sau khi đã lọc theo từ khóa tìm kiếm */}

        {filteredCars.length > 0 ? (

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 max-w-7xl mx-auto'>

            {filteredCars.map((car, index)=>(

              <motion.div

              initial={{opacity:0, y:20}}

              whileInView={{opacity:1, y:0}}

              transition={{delay:0.1*index, duration:0.4, ease: "easeOut"}}

              key={car._id || index} className="hover:-translate-y-1 transition-transform duration-300">

                <CarCard car={car}/>

              </motion.div>

            ))}

          </div>

        ) : (

          /* Trạng thái không tìm thấy kết quả phù hợp */

          <div className="text-center py-20 max-w-7xl mx-auto bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 mt-6">

            <p className="text-gray-400 font-medium text-base">Không tìm thấy chiếc xe nào phù hợp với từ khóa của bạn.</p>

            <button onClick={() => setInput('')} className="mt-4 text-xs font-bold text-[#0D9488] hover:text-[#115E59] underline cursor-pointer">

              Xóa bộ lọc tìm kiếm

            </button>

          </div>

        )}

      </motion.div>

    </div>

  )

}



export default Cars; 

