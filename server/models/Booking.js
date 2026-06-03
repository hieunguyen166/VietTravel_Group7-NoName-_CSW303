import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types

const bookingSchema = new mongoose.Schema({
    car: {type: ObjectId, ref: "Car", required: true},
    user: {type: ObjectId, ref: "User", required: true},
    owner: {type: ObjectId, ref: "User", required: true},
    pickupDate: {type: Date, required: true},
    returnDate: {type: Date, required: true},
    status: {type: String, enum: ["Đang chờ xác nhận", "Đã xác nhận", "Đã hủy"], default: "Đang chờ xác nhận"},
    price: {type: Number, required: true}
},{timestamps: true})

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking
