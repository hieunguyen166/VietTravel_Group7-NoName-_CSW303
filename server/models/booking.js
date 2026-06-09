import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
    car: { type: ObjectId, ref: "Car", required: true },
    user: { type: ObjectId, ref: "User", required: true },
    owner: { type: ObjectId, ref: "User", required: true },
    driveType: { 
        type: String, 
        enum: ["self-drive", "with-driver"], 
        required: true 
    },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    status: { 
        type: String, 
        // Đã thêm "Chờ thanh toán" vào danh sách hợp lệ
        enum: ["Đang chờ xác nhận", "Chờ thanh toán", "Đã xác nhận", "Đã hủy"], 
        default: "Đang chờ xác nhận" 
    },
    price: { type: Number, required: true },
    
    paymentMethod: { type: String, default: 'Cash' }, 
    isPaid: { type: Boolean, default: false },
    isReviewed: {
    type: Boolean,
    default: false
}
}, { timestamps: true });
    

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;