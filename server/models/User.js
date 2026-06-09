import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["owner", "user", "admin"],
        default: "user"
    },

    // Giữ nguyên trường này để làm ảnh đại diện (Avatar) cho người dùng
    image: {
        type: String,
        default: ""
    },

    // 🆕 CÁC TRƯỜNG MỚI BỔ SUNG CHO TRANG USER PROFILE TẠI ĐÂY:
    age: {
        type: Number,
        default: null // Mặc định là null khi vừa mới đăng ký tài khoản
    },

    address: {
        type: String,
        default: "" // Mặc định là chuỗi rỗng
    },

    phone: {
        type: String,
        default: ""
        //unique: true // Mặc định là chuỗi rỗng
    },

    driverLicense: {
        type: String,
        default: "" // Lưu đường dẫn URL ảnh Giấy phép lái xe sau khi tải lên
    }

}, { timestamps: true });

export default mongoose.models.User ||
mongoose.model("User", userSchema);