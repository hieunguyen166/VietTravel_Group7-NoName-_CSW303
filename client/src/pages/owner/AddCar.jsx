import { useState } from 'react';

import { toast } from 'react-hot-toast';

import { assets } from '../../assets/assets';

import Title from '../../components/owner/Title';

import { useAppContext } from '../../context/AppContext';



const AddCar = () => {



  const {axios, currency} = useAppContext();



  const [image, setImage] = useState(null)

  const [car, setCar] = useState({

    brand: '',

    model: '',

    year: 0,

    pricePerDay: 0,

    category: '',

    transmission: '',

    fuel_type: '',

    seating_capacity: 0,

    location: '',

    description: '',

  })



  const [isLoading, setIsLoading] = useState(false)

  const onSubmitHandler = async (e) => {

    e.preventDefault()

    if(isLoading) return null



    setIsLoading(true)

    try {

      const formData = new FormData()

      formData.append('image', image)

      formData.append('carData', JSON.stringify(car))



      const { data } = await axios.post('/api/owner/add-car', formData)



        if(data.success){

            toast.success(data.message)

            setImage(null)

            setCar({

              brand: '',

              model: '',

              year: 0,

              pricePerDay: 0,

              category: '',

              transmission: '',

              fuel_type: '',

              seating_capacity: 0,

              location: '',

              description: '',

            })

        }else{

          toast.error(data.message)

        }

      } catch (error) {

          toast.error(error.message)

      }finally{

          setIsLoading(false)

      }

  }



  return (

    <div className='px-4 py-10 md:px-10 flex-1 font-bevietnam antialiased'>

      <Title

        title="Thêm Xe Mới"

        subTitle="Điền đầy đủ thông tin chi tiết để đăng ký niêm yết xe mới lên hệ thống, bao gồm giá thuê, thông số kỹ thuật và khu vực vận hành."

      />



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

            <input type="text" placeholder="Ví dụ: BMW, Mercedes, Audi, VinFast..." required className='px-3 py-2 border border-borderColor rounded-md outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all text-gray-900 font-medium' value={car.brand} onChange={e => setCar({...car, brand: e.target.value})}/>

          </div>

          <div className='flex flex-col w-full'>

            <label className="font-bold text-gray-800 mb-1.5">Dòng xe (Model)</label>

            <input type="text" placeholder="Ví dụ: X5, E-Class, VF8..." required className='px-3 py-2 border border-borderColor rounded-md outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all text-gray-900 font-medium' value={car.model} onChange={e => setCar({...car, model: e.target.value})}/>

          </div>

        </div>



        {/* Năm sản xuất & Giá thuê & Phân khúc */}

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>

          <div className='flex flex-col w-full'>

            <label className="font-bold text-gray-800 mb-1.5">Năm sản xuất</label>

            <input type="number" placeholder="2026" required className='px-3 py-2 border border-borderColor rounded-md outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all text-gray-900 font-mplus font-bold' value={car.year || ''} onChange={e => setCar({...car, year: e.target.value})}/>

          </div>

          <div className='flex flex-col w-full'>

            <label className="font-bold text-gray-800 mb-1.5">Giá thuê / Ngày ({currency})</label>

            <input type="number" placeholder="500000" required className='px-3 py-2 border border-borderColor rounded-md outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all text-gray-900 font-mplus font-bold' value={car.pricePerDay || ''} onChange={e => setCar({...car, pricePerDay: e.target.value})}/>

          </div>

          <div className='flex flex-col w-full'>

            <label className="font-bold text-gray-800 mb-1.5">Phân khúc xe</label>

              <select onChange={e => setCar({...car, category: e.target.value})} value={car.category} className='px-3 py-2 border border-borderColor rounded-md outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all text-gray-900 font-medium bg-white'>

                <option value="">Chọn phân khúc</option>

                <option value="Sedan">Sedan (Bốn chỗ)</option>

                <option value="SUV">SUV (Gầm cao)</option>

                <option value="Van">Van (Đa dụng / Xe tải nhỏ)</option>

              </select>

          </div>

        </div>



        {/* Hộp số, Loại nhiên liệu & Số chỗ ngồi */}

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>

          <div className='flex flex-col w-full'>

            <label className="font-bold text-gray-800 mb-1.5">Hộp số</label>

            {/* 🛠️ ĐÃ CẬP NHẬT: Lưu trực tiếp chuỗi Tiếng Việt vào database */}

            <select onChange={e => setCar({...car, transmission: e.target.value})} value={car.transmission} className='px-3 py-2 border border-borderColor rounded-md outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all text-gray-900 font-medium bg-white'>

              <option value="">Chọn hộp số</option>

              <option value="Số tự động">Số tự động (Auto)</option>

              <option value="Bán Tự động">Bán Tự động (Semi-Auto)</option>

              <option value="Số sàn">Số sàn (Manual)</option>

            </select>

          </div>

          <div className='flex flex-col w-full'>

            <label className="font-bold text-gray-800 mb-1.5">Loại nhiên liệu</label>

            <select onChange={e => setCar({...car, fuel_type: e.target.value})} value={car.fuel_type} className='px-3 py-2 border border-borderColor rounded-md outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all text-gray-900 font-medium bg-white'>

              <option value="">Chọn nhiên liệu</option>

              <option value="Diesel">Dầu Diesel</option>

              <option value="Xăng">Xăng (Petrol)</option>

              <option value="Động cơ Điện">Động cơ Điện</option>

              <option value="Hybrid">Động cơ Hybrid</option>

            </select>

          </div>

          <div className='flex flex-col w-full'>

            <label className="font-bold text-gray-800 mb-1.5">Số chỗ ngồi</label>

            <input type="number" placeholder="4" required className='px-3 py-2 border border-borderColor rounded-md outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all text-gray-900 font-mplus font-bold' value={car.seating_capacity || ''} onChange={e => setCar({...car, seating_capacity: e.target.value})}/>

          </div>

        </div>

       

        {/* Khu vực hoạt động */}

        <div className='flex flex-col w-full'>

          <label className="font-bold text-gray-800 mb-1.5">Khu vực bàn giao xe</label>

          <select onChange={e => setCar({...car, location: e.target.value})} value={car.location} className='px-3 py-2 border border-borderColor rounded-md outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all text-gray-900 font-medium bg-white'>

            <option value="">Chọn khu vực thành phố</option>

            <option value="TP HCM">TP. Hồ Chí Minh</option>

            <option value="Da Lat">Đà Lạt</option>

            <option value="Da Nang">Đà Nẵng</option>

            <option value="Hanoi">Hà Nội</option>

          </select>

        </div>



        {/* Mô tả chi tiết */}

        <div className='flex flex-col w-full'>

          <label className="font-bold text-gray-800 mb-1.5">Mô tả chi tiết</label>

          <textarea rows={5} placeholder="Ví dụ: Xe SUV hạng sang sở hữu không gian nội thất cực kỳ rộng rãi..." required className='px-3 py-2 border border-borderColor rounded-md outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all text-gray-900 font-medium leading-relaxed' value={car.description} onChange={e => setCar({...car, description: e.target.value})}></textarea>

        </div>



        {/* NÚT SUBMIT */}

        <button className='flex items-center justify-center gap-2 px-6 py-3 mt-4 bg-[#115E59] hover:bg-[#0D9488] text-white rounded-xl font-mplus font-bold text-sm tracking-wider uppercase cursor-pointer shadow-lg shadow-teal-900/10 active:scale-[0.98] transition-all duration-300 w-full sm:w-max'>

          <img src={assets.tick_icon} alt="Tick" className="w-4 h-4 invert brightness-200" />

          {isLoading ? 'Đang xử lý...' : 'Xác nhận đăng ký xe'}

        </button>

      </form>

    </div>

  )

}



export default AddCar; 