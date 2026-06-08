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

// NẠP TẤT CẢ ROUTE
app.use('/api/user', userRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/bookings', bookingRouter);
app.use('/api/review', reviewRoutes);


const PORT = process.env.PORT || 3000;
mongoose.set('bufferCommands', false);
const startServer = async () => {
    try {
        await connectDB();
        console.log("READY STATE:", mongoose.connection.readyState);
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại port ${PORT}`);
        });
    } catch (error) {
        console.log("Lỗi khởi động server:", error.message);
    }
};

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}


startServer();