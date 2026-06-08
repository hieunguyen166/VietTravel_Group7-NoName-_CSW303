import cors from 'cors';
import "dotenv/config";
import express from 'express';
import fs from 'fs';
import mongoose from "mongoose";
import connectDB from './configs/db.js';
import bookingRouter from './routes/bookingRoutes.js';
import ownerRoutes from './routes/ownerRoute.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// PHẢI ĐẶT MIDDLEWARE LOG TRƯỚC TẤT CẢ CÁC ROUTE ĐỂ BẮT MỌI REQUEST
app.use((req, res, next) => {
    console.log(`Request nhận được: ${req.method} ${req.url}`);
    next();
});

// 🛠️ SỬA CƠ CHẾ KẾT NỐI DB: Chạy trực tiếp ở luồng chính (Tối ưu cho Serverless)
mongoose.set('bufferCommands', false);
connectDB()
    .then(() => console.log("READY STATE:", mongoose.connection.readyState))
    .catch((err) => console.log("Lỗi kết nối DB ban đầu:", err.message));

// NẠP TẤT CẢ ROUTE
app.use('/api/user', userRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/bookings', bookingRouter);
app.use('/api/review', reviewRoutes);

// 🎁 THÊM ROUTE TEST: Giúp bạn truy cập trực tiếp vào link Vercel BE để check xem BE đã sống chưa
app.get('/', (req, res) => {
    res.json({ success: true, message: "🚀 VietTrav Backend đang hoạt động mượt mà trên Vercel!" });
});

// 🛠️ SỬA LỖI UPLOADS: Bọc try-catch để không bị crash trên hệ thống Read-only của Vercel
const uploadDir = './uploads';
try {
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }
} catch (error) {
    console.log("Lưu ý: Đang chạy trên Vercel (Read-only), bỏ qua lệnh tạo thư mục local.");
}

// 🛠️ CHỈ CHẠY APP.LISTEN KHI Ở LOCAL (Môi trường Vercel sẽ tự quản lý port)
const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server đang chạy tại port ${PORT}`);
    });
}

// 🛠️ BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ VERCEL ĐỌC ĐƯỢC EXPRESS APP
export default app;