import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom'; // 🌟 THÊM DÒNG NÀY: Để dùng thẻ chuyển hướng Link
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { useAppContext } from '../context/AppContext';

const MyBookings = () => {
  const { axios, user, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [selectedQr, setSelectedQr] = useState(null); 
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewedBookings, setReviewedBookings] = useState([]);

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get(`/api/bookings/user`);
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error('Không thể tải lịch sử đặt xe của bạn.');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải dữ liệu.');
    }
  };

  const submitReview = async () => {
    if (!reviewComment.trim()) {
      toast.error('Vui lòng viết nhận xét trước khi gửi.');
      return;
    }
    try {
      const userId = user._id || user.id;
      const { data } = await axios.post(`/api/review/add`, {
        bookingId: selectedBookingForReview,
        userId: userId,
        rating: reviewRating,
        comment: reviewComment
      });
      
      toast.success('Đánh giá chuyến đi thành công!');
      setReviewedBookings(prev => [...prev, selectedBookingForReview]);
      setSelectedBookingForReview(null);
      setReviewRating(5);
      setReviewComment('');
      fetchMyBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gửi đánh giá thất bại, vui lòng thử lại.');
    }
  };

  useEffect(() => {
    user && fetchMyBookings();
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mx-auto font-bevietnam antialiased mb-20'
    >
      <Title title='Chuyến Đi Của Tôi' subTitle='Xem và quản lý toàn bộ danh sách lịch sử đơn đặt xe của bạn' align="left" />

      <div className="space-y-6">
        {bookings.map((booking, index) => {
          const isAlreadyReviewed = reviewedBookings.includes(booking._id) || booking.isReviewed;

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              key={booking._id || index}
              className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-xl mt-5 first:mt-12 bg-white shadow-sm hover:shadow-md transition-shadow duration-300'
            >
              {/* 🛠️ CỘT 1: HÌNH ẢNH XE & TÊN XE (ĐÃ ĐƯỢC BỌC LINK CHUYỂN HƯỚNG) */}
              <div className='md:col-span-1'>
                {booking.car ? (
                  // Nếu xe tồn tại, bọc toàn bộ khối ảnh + tên bằng thẻ <Link> để click điều hướng
                  <Link to={`/car-details/${booking.car._id || booking.car.id}`} className="group block cursor-pointer">
                    <div className='rounded-lg overflow-hidden border border-gray-100 shadow-inner bg-gray-50'>
                      <img
                        src={booking.car.image || assets.default_car_icon}
                        alt="Car"
                        className='w-full h-auto aspect-video object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    </div>
                    <p className='text-base font-mplus font-extrabold text-gray-900 mt-3 tracking-tight group-hover:text-[#115E59] transition-colors'>
                      {booking.car.brand} {booking.car.model}
                    </p>
                    <p className='text-xs text-gray-400 mt-0.5 font-medium'>
                      Năm <span className="font-mplus font-bold text-gray-500">{booking.car.year}</span> <span className="mx-1">•</span> {booking.car.category}
                    </p>
                  </Link>
                ) : (
                  // Trường hợp dự phòng nếu xe này đã bị Admin xóa khỏi hệ thống database
                  <div>
                    <div className='rounded-lg overflow-hidden border border-gray-100 shadow-inner bg-gray-50 opacity-60'>
                      <img src={assets.default_car_icon} alt="Car Deleted" className='w-full h-auto aspect-video object-cover' />
                    </div>
                    <p className='text-base font-mplus font-extrabold text-gray-400 mt-3 tracking-tight italic'>
                      Xe không xác định
                    </p>
                    <p className='text-xs text-gray-400 mt-0.5 font-medium italic'>
                      Thông tin xe đã bị xóa khỏi hệ thống
                    </p>
                  </div>
                )}
              </div>

              {/* Cột 2 & 3: Chi tiết lịch trình */}
              <div className='md:col-span-2 space-y-4'>
                <div className='flex items-center gap-3.5'>
                  <p className='px-2.5 py-1 bg-slate-50 border border-slate-100 rounded text-xs font-mplus font-bold text-gray-500 uppercase tracking-wide'>
                    Mã đơn #{index + 1}
                  </p>
                  <div className="flex flex-col gap-2">
                    <p className={`px-3 py-0.5 text-xs font-bold rounded-full border text-center ${
                        booking.status === 'Đã xác nhận' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        booking.status === 'Chờ thanh toán' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        booking.status === 'Đang chờ xác nhận' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {booking.status}
                    </p>

                    {booking.status === 'Chờ thanh toán' && (
                      <button 
                        onClick={() => {
                            const qrUrl = `https://api.vietqr.io/image/970415-0000000000-qRz5vYk.jpg?amount=${booking.price}&addInfo=ThanhToanDonHang${booking._id}`;
                            setSelectedQr(qrUrl);
                        }}
                        className="text-[10px] bg-[#115E59] text-white py-1 px-3 rounded hover:bg-[#0D9488] transition-colors font-bold uppercase tracking-wider"
                      >
                        Thanh toán ngay
                      </button>
                    )}
                  </div>
                </div>

                <div className='flex items-start gap-3 mt-3'>
                  <div className="p-1.5 bg-[#115E59]/5 rounded-lg shrink-0 mt-0.5 border border-[#115E59]/10">
                    <img src={assets.calendar_icon_colored} alt="Lịch" className='w-4 h-4' />
                  </div>
                  <div>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-wide'>Thời gian thuê</p>
                    <p className='text-sm font-mplus font-bold text-gray-700 mt-0.5'>
                      {booking.pickupDate?.split('T')[0]} <span className="text-gray-300 font-normal mx-1.5">đến</span> {booking.returnDate?.split('T')[0]}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <div className="p-1.5 bg-[#115E59]/5 rounded-lg shrink-0 mt-0.5 border border-[#115E59]/10">
                    <img src={assets.location_icon_colored} alt="Địa điểm" className='w-4 h-4' />
                  </div>
                  <div>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-wide'>Địa điểm nhận xe</p>
                    <p className='text-sm font-semibold text-gray-700 mt-0.5'>{booking.car?.location || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Cột 4: Tổng tiền & Nút Đánh giá */}
              <div className='md:col-span-1 flex flex-col justify-between gap-4 md:text-right border-t md:border-t-0 md:border-l border-borderColor/60 pt-4 md:pt-0 md:pl-4'>
                <div className='text-sm text-gray-500 space-y-2'>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Tổng chi phí</p>
                  <h1 className='text-2xl font-mplus font-extrabold text-[#115E59] tracking-tight'>
                    {Number(booking.price).toLocaleString()} <span className="text-sm font-bevietnam font-bold opacity-80">{currency}</span>
                  </h1>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Đặt ngày: <span className="font-mplus font-semibold">{booking.createdAt?.split('T')[0]}</span>
                  </p>

                  {booking.status === 'Đã xác nhận' && (
                    <button 
                      disabled={isAlreadyReviewed}
                      onClick={() => !isAlreadyReviewed && setSelectedBookingForReview(booking._id)}
                      className={`inline-block text-[10px] py-1.5 px-3 rounded font-bold uppercase tracking-wider text-center mt-1 transition-all duration-300 ${
                        isAlreadyReviewed 
                          ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60 pointer-events-none' 
                          : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm cursor-pointer' 
                      }`}
                    >
                      {isAlreadyReviewed ? '✓ Đã đánh giá' : 'Đánh giá chuyến đi'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal Popup nhập Đánh giá */}
      {selectedBookingForReview && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setSelectedBookingForReview(null);
            setReviewRating(5);
            setReviewComment('');
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white flex flex-col p-6 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full mx-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-mplus font-extrabold text-[#115E59]">Đánh giá trải nghiệm</h2>
            
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Chọn số sao</label>
              <select 
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full border border-gray-200 p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#115E59] text-sm"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Sao - Rất tốt)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Sao - Tốt)</option>
                <option value={3}>⭐⭐⭐ (3 Sao - Bình thường)</option>
                <option value={2}>⭐⭐ (2 Sao - Tệ)</option>
                <option value={1}>⭐ (1 Sao - Rất tệ)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Nội dung nhận xét</label>
              <textarea 
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Nhập nhận xét của bạn về chiếc xe và chủ xe..."
                className="w-full border border-gray-200 p-3 rounded-xl h-28 focus:outline-none focus:border-[#115E59] text-sm resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  setSelectedBookingForReview(null);
                  setReviewRating(5);
                  setReviewComment('');
                }}
                className="flex-1 py-2.5 border border-gray-200 font-bold rounded-full text-gray-500 hover:bg-gray-50 transition-all text-xs uppercase tracking-wider"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={submitReview}
                className="flex-1 py-2.5 bg-[#115E59] text-white font-bold rounded-full hover:bg-[#0D9488] transition-all text-xs uppercase tracking-wider"
              >
                Gửi đánh giá
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal QR toàn màn hình */}
      {selectedQr && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-sm"
          onClick={() => setSelectedQr(null)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center p-8 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-mplus font-extrabold text-[#115E59] mb-6">Thanh toán VNPAY</h2>
            <div className="bg-white p-4 rounded-3xl shadow-2xl border border-gray-100">
              <img src={selectedQr} alt="QR Code" className="w-80 h-80 object-contain" />
            </div>
            <p className="mt-8 text-gray-600 font-medium text-center">
              Vui lòng mở ứng dụng ngân hàng và quét mã để hoàn tất thanh toán.
            </p>
            <button 
              onClick={() => setSelectedQr(null)}
              className="mt-6 px-8 py-3 bg-[#115E59] text-white font-bold rounded-full hover:bg-[#0D9488] transition-all"
            >
              Đóng mã QR
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default MyBookings;