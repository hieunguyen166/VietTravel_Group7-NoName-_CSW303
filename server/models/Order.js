import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    // Liên kết tới các thực thể chính
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },

    // Thông tin tài chính
    totalAmount: { type: Number, required: true },       // Tổng số tiền khách thanh toán
    adminCommission: { type: Number, required: true },  // 5% (Phần của bạn)
    ownerAmount: { type: Number, required: true },      // 95% (Phần chủ xe)

    // Trạng thái đơn hàng
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'refunded'], 
        default: 'pending' 
    },
    // Trạng thái đối soát (giúp bạn quản lý việc đã chuyển tiền cho chủ xe hay chưa)
    settlementStatus: { 
        type: String, 
        enum: ['unsettled', 'settled'], 
        default: 'unsettled' 
    }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);