import Car from '../models/Car.js';
import Order from '../models/Order.js';
import Booking from '../models/booking.js';

export const getAdminStats = async (req, res) => {
    try {
        // 1. Chạy song song các lệnh đếm để tối ưu hiệu suất
        const [totalCars, totalBookings, orders] = await Promise.all([
            Car.countDocuments(),
            Booking.countDocuments(),
            Order.find({}) // Lấy tất cả orders để tính toán doanh thu
        ]);

        // 2. Tính toán doanh thu từ mảng orders
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const totalAdminCommission = orders.reduce((sum, order) => sum + (order.adminCommission || 0), 0);
        const totalOwnerAmount = orders.reduce((sum, order) => sum + (order.ownerAmount || 0), 0);

        // 3. Trả về kết quả
        res.json({
            success: true,
            stats: {
                totalCars,
                totalBookings,
                totalRevenue,
                totalAdminCommission,
                totalOwnerAmount
            }
        });
    } catch (error) {
        console.error("Lỗi tại getAdminStats:", error);
        res.json({ success: false, message: error.message });
    }
}