import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import MyBookings from './MyBookings';

const UserProfile = () => {
  const { axios, user, setUser, fetchUser } = useAppContext();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [gplxFile, setGplxFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [gplxPreview, setGplxPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAge(user.age || '');
      setAddress(user.address || '');
      setPhone(user.phone || '');
      setImagePreview(user.image || '');
      setGplxPreview(user.driverLicense || '');
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGplxChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGplxFile(file);
      setGplxPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    
    // Ép buộc gửi string/số
    formData.append('name', name || '');
    formData.append('age', age ? age.toString() : '');
    formData.append('address', address || '');
    formData.append('phone', phone || '');

    if (imageFile) formData.append('image', imageFile);
    if (gplxFile) formData.append('driverLicense', gplxFile);

    try {
        const { data } = await axios.put('/api/user/update-profile', formData);
        if (data.success) {
            toast.success('Cập nhật thành công!');
            setUser(data.user);
        }
    } catch (error) {
        console.error(error);
        toast.error('Lỗi server');
    } finally {
        setLoading(false);
    }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      // 🎯 Đóng khung ở mức 1440px trung hòa, kết hợp padding md:px-12 để cân bằng tỉ lệ thị giác
      className='max-w-[1440px] mx-auto w-full px-4 md:px-12 mt-8 mb-20'
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
        
        {/* 📐 CỘT TRÁI (320px): Form thông tin tài khoản */}
        <div className="w-full lg:w-[320px] shrink-0 bg-white border border-gray-200 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-xs font-bold text-[#115E59] uppercase tracking-wider">
              Thông tin tài khoản
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Cập nhật thông tin cá nhân của bạn</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {/* Avatar */}
            <div className="flex flex-col items-center justify-center space-y-1.5 py-2 bg-gray-50/50 rounded-xl border border-gray-100">
              <label htmlFor="image-input" className="relative group cursor-pointer block">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white ring-2 ring-gray-100 group-hover:ring-[#115E59] transition-all shadow-sm">
                  <img 
                    src={imagePreview || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] text-white font-bold uppercase tracking-wider">Thay ảnh</span>
                </div>
              </label>
              <input type="file" id="image-input" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>

            {/* Form Fields */}
<div>
  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">Họ và tên</label>
  <input 
    type="text" 
    value={name} 
    onChange={(e) => setName(e.target.value)}
    required
    className="w-full border border-gray-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#115E59]"
  />
</div>

{/* Thêm trường Phone ở đây */}
<div>
  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">Số điện thoại</label>
  <input 
    type="tel" 
    value={phone} 
    onChange={(e) => setPhone(e.target.value)}
    className="w-full border border-gray-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#115E59]"
  />
</div>

<div className="grid grid-cols-3 gap-2">
  <div>
    <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">Tuổi</label>
    <input 
      type="number" 
      value={age} 
      onChange={(e) => setAge(e.target.value)}
      className="w-full border border-gray-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#115E59]"
    />
  </div>
  <div className="col-span-2">
    <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">Địa chỉ</label>
    <input 
      type="text" 
      value={address} 
      onChange={(e) => setAddress(e.target.value)}
      className="w-full border border-gray-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#115E59]"
    />
  </div>
</div>

            {/* GPLX */}
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">Giấy phép lái xe (GPLX)</label>
              <label htmlFor="gplx-input" className="block w-full aspect-[16/10] border border-dashed border-gray-300 rounded-xl overflow-hidden relative cursor-pointer hover:border-[#115E59] bg-gray-50 transition-all">
                {gplxPreview ? (
                  <img src={gplxPreview} alt="GPLX" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <span className="text-lg mb-0.5">🪪</span>
                    <p className="text-[10px] text-gray-500 font-bold">Tải lên mặt trước GPLX</p>
                  </div>
                )}
              </label>
              <input type="file" id="gplx-input" accept="image/*" className="hidden" onChange={handleGplxChange} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#115E59] text-white font-bold rounded-xl hover:bg-[#0D9488] transition-all text-xs uppercase tracking-widest disabled:bg-gray-400 shadow-sm active:scale-[0.99]"
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>

        {/* ⚡ CỘT PHẢI (BOOKING): Rộng vừa vặn, chuẩn chỉ, ôm trọn danh sách xe */}
        <div className="flex-1 min-w-0 w-full bg-white border border-gray-200 p-5 md:p-6 rounded-2xl shadow-sm">
          <div className="border-b border-gray-100 pb-3 mb-5">
            <h3 className="text-xs font-bold text-[#115E59] uppercase tracking-wider">
              Lịch sử chuyến đi của bạn
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Quản lý hành trình chi tiết các đơn đặt xe</p>
          </div>
          
          <MyBookings />
        </div>

      </div>
    </motion.div>
  );
};

export default UserProfile;