import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // 🛠️ Thêm trường này để lưu vết xe được đánh giá
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true }, 
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);