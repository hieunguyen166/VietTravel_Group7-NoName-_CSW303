import Booking from '../models/booking.js';
import Review from '../models/Review.js';

// Hàm 1: Thêm đánh giá mới (Bạn đã có)
export const addReview = async (req, res) => {
    console.log("Dữ liệu nhận được từ Postman/Frontend:", req.body);
    try {
        const { bookingId, userId, rating, comment } = req.body;

        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy đơn đặt xe hợp lệ!" 
            });
        }

        const newReview = new Review({ 
            bookingId, 
            userId, 
            carId: booking.car, 
            rating, 
            comment 
        });

        await newReview.save();
        await Booking.findByIdAndUpdate(bookingId, { isReviewed: true });

        res.status(201).json({ 
            success: true, 
            message: "Đánh giá thành công!", 
            review: newReview 
        });

    } catch (error) {
        console.error("🔥 LỖI TẠI HÀM ADD_REVIEW:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi khi lưu đánh giá", 
            error: error.message 
        });
    }
};

// Hàm 2: Lấy danh sách đánh giá của một chiếc xe cụ thể (BẠN ĐANG BỊ THIẾU HÀM NÀY)
export const getCarReviews = async (req, res) => {
    try {
        const { id } = req.params; // Nhận carId từ URL

        // Tìm các review có carId khớp, đồng thời nạp thêm Tên và Ảnh của User
        const reviews = await Review.find({ carId: id })
                                    .populate('userId', 'name image') 
                                    .sort({ createdAt: -1 }); // Mới nhất xếp lên đầu

        res.status(200).json({ 
            success: true, 
            reviews 
        });
    } catch (error) {
        console.error("🔥 LỖI TẠI HÀM GET_CAR_REVIEWS:", error); 
        res.status(500).json({ 
            success: false, 
            message: "Lỗi khi lấy đánh giá của xe", 
            error: error.message 
        });
    }
};

// Thêm hàm này vào CUỐI FILE controller của bạn:

// Lấy TẤT CẢ đánh giá hệ thống để hiển thị ở trang Chủ (Home)
export const getAllReviews = async (req, res) => {
    try {
        // Lấy toàn bộ review, đồng thời nạp thông tin Tên/Ảnh của người đánh giá
        const reviews = await Review.find({})
                                    .populate('userId', 'name image') 
                                    .sort({ createdAt: -1 }); // Đánh giá mới nhất xếp lên đầu

        res.status(200).json({ 
            success: true, 
            reviews 
        });
    } catch (error) {
        console.error("🔥 LỖI TẠI HÀM GET_ALL_REVIEWS:", error); 
        res.status(500).json({ 
            success: false, 
            message: "Lỗi khi lấy tất cả đánh giá", 
            error: error.message 
        });
    }
};