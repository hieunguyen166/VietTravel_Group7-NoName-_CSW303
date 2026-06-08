import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Testimonial = ({ reviews }) => {
  const { axios } = useAppContext();
  const [allReviews, setAllReviews] = useState([]);

  // 1. Tự động lấy tất cả đánh giá phục vụ cho TRANG CHỦ nếu không có props 'reviews' truyền vào
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        if (!reviews || reviews.length === 0) {
          const { data } = await axios.get('/api/review/all');
          if (data.success) {
            setAllReviews(data.reviews || []);
          }
        }
      } catch (error) {
        console.error("Lỗi lấy tất cả review ở trang Home:", error);
      }
    };
    fetchAllReviews();
  }, [reviews, axios]);

  // Quyết định nguồn dữ liệu hiển thị (Ưu tiên props từ trang Chi tiết xe truyền xuống)
  const displayReviews = reviews && reviews.length > 0 ? reviews : allReviews;

  // Giao diện thẻ đánh giá đơn lẻ (Được format chuẩn theo style mẫu của bạn)
  const CreateCard = ({ review }) => {
    // Hàm render sao đánh giá dựa vào trường 'rating' trong database của bạn
    const renderStars = (rating) => {
      return Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={`text-sm ${index < rating ? 'text-amber-500' : 'text-gray-200'}`}>
          ★
        </span>
      ));
    };

    return (
      <div className="p-5 rounded-xl mx-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 w-80 shrink-0 bg-white flex flex-col justify-between">
        <div>
          {/* Phần Header của Card: Ảnh, Tên, Huy hiệu Xác thực */}
          <div className="flex gap-3 items-center">
            <img 
              className="size-11 rounded-full object-cover border border-gray-100 bg-gray-50" 
              src={review.userId?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'} // Ảnh mặc định nếu user thiếu ảnh
              alt={review.userId?.name || "Khách hàng"} 
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <p className="font-bevietnam font-bold text-gray-800 text-sm">{review.userId?.name || 'Ẩn danh'}</p>
                {/* Tích xanh xác thực từ code mẫu của bạn */}
                <svg className="mt-0.5 fill-teal-600 shrink-0" width="13" height="13" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" />
                </svg>
              </div>
              {/* Hiển thị số Sao */}
              <div className="flex items-center gap-0.5 mt-0.5">
                {renderStars(review.rating)}
              </div>
            </div>
          </div>

          {/* Nội dung bình luận thực tế */}
          <p className="text-sm pt-4 text-gray-600 leading-relaxed font-medium italic font-bevietnam">
            "{review.comment}"
          </p>
        </div>
      </div>
    );
  };

  // Điều kiện bảo vệ: Nếu hệ thống chưa có review nào thì không hiển thị khung trống
  if (displayReviews.length === 0) return null;

  // 🛠️ Nhân bản mảng dữ liệu gấp nhiều lần để tạo chuỗi dài liền mạch, tránh bị hụt khi cuộn vô tận
  const repeatedReviewsRow1 = [...displayReviews, ...displayReviews, ...displayReviews, ...displayReviews];
  const repeatedReviewsRow2 = [...displayReviews, ...displayReviews, ...displayReviews, ...displayReviews];

  return (
    <div className="py-12 bg-gray-50/40 rounded-3xl mt-6 select-none overflow-hidden">
      {/* Tiêu đề phần Đánh giá khách hàng */}
      <div className="text-center mb-4 px-6">
        <h2 className="text-2xl font-mplus font-extrabold text-gray-900 tracking-tight">Khách hàng nói gì về chúng tôi?</h2>
        <p className="text-gray-400 text-sm mt-1 font-medium font-bevietnam">Những trải nghiệm chân thực từ những người đã thuê xe</p>
      </div>

      {/* Tích hợp khối CSS Animation dạng nhúng từ code mẫu */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .marquee-inner {
          animation: marqueeScroll 35s linear infinite;
        }

        .marquee-inner:hover {
          animation-play-state: paused; /* Đưa chuột vào sẽ tạm dừng cuộn để người dùng dễ đọc */
        }

        .marquee-reverse {
          animation-direction: reverse;
        }
      `}</style>

      {/* HÀNG 1: CHẠY TỪ PHẢI SANG TRÁI */}
      <div className="marquee-row w-full mx-auto max-w-7xl overflow-hidden relative mt-2">
        {/* Lớp mờ (Gradient) bên trái */}
        <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-r from-gray-50 via-gray-50/70 to-transparent"></div>
        
        <div className="marquee-inner flex transform-gpu min-w-[200%] py-4">
          {repeatedReviewsRow1.map((review, index) => (
            <CreateCard key={`row1-${index}`} review={review} />
          ))}
        </div>

        {/* Lớp mờ (Gradient) bên phải */}
        <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-l from-gray-50 via-gray-50/70 to-transparent"></div>
      </div>

      {/* HÀNG 2: CHẠY NGƯỢC CHIỀU (TỪ TRÁI SANG PHẢI) */}
      <div className="marquee-row w-full mx-auto max-w-7xl overflow-hidden relative mt-2">
        <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-r from-gray-50 via-gray-50/70 to-transparent"></div>
        
        <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] py-4">
          {repeatedReviewsRow2.map((review, index) => (
            <CreateCard key={`row2-${index}`} review={review} />
          ))}
        </div>

        <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-l from-gray-50 via-gray-50/70 to-transparent"></div>
      </div>
    </div>
  );
};

export default Testimonial;