import fs from 'fs';
import mongoose from "mongoose";
import imagekit from "../configs/imageKit.js";
import Booking from "../models/booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
export const changeRoleToOwner = async (req, res) => {
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role: "owner"})
        res.json({success: true, message: "Quyền chủ xe đã được cấp. Bạn có thể bắt đầu thêm phương tiện của mình!"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


//API to list car

export const addCar = async (req, res) => {
    console.log("--- BẠN ĐANG CHẠY CODE PHIÊN BẢN ĐÃ SỬA LỖI ---");
    try {
        const { _id } = req.user;
        const carData = JSON.parse(req.body.carData);
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Vui lòng chọn hình ảnh xe" });
        }

        // 1. Upload ảnh lên ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        });

        // 2. Tạo biến optimizedImageUrl ngay tại đây (cùng phạm vi)
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '1280' },
                { quality: 'auto' },
                { format: 'webp' }
            ]
        });

        // 3. Tạo xe trong Database
        const newCar = await Car.create({
            owner: _id,
            image: optimizedImageUrl,
            brand: carData.brand,
            model: carData.model,
            year: carData.year,
            category: carData.category,
            seating_capacity: carData.seating_capacity,
            fuel_type: carData.fuel_type,
            transmission: carData.transmission,
            pricePerDay: carData.pricePerDay,
            location: carData.location,
            description: carData.description,
            lat: carData.lat,
            lng: carData.lng,
            isAvailable: true,
            city: carData.city // ✅ ĐÃ SỬA: Lấy đúng biến city từ form gửi lên
        });

        res.json({ success: true, message: "Xe đã được thêm thành công", car: newCar });

    } catch (error) {
        console.error("LỖI HỆ THỐNG:", error);
        res.json({ success: false, message: error.message });
    }
}


// API to List Owner's Cars
export const getOwnerCars = async (req, res)=>{
    try {
        const {_id} = req.user;
        const cars = await Car.find({owner: _id});
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Toggle Car Availability
export const toggleCarAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;

        const car = await Car.findById(carId);

        if (!car) {
            return res.json({ success: false, message: "Không tìm thấy phương tiện" });
        }

        // Kiểm tra quyền sở hữu xe
        if (car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Không có quyền chỉnh sửa phương tiện này" });
        }

        // Lấy trạng thái hiện tại (Kiểm tra linh hoạt cả 2 kiểu viết chính tả)
        const currentStatus = car.isAvailable !== undefined ? car.isAvailable : car.isAvaliable;
        const newStatus = !currentStatus;

        // FIX DỨT ĐIỂM: Dùng findByIdAndUpdate để ép MongoDB cập nhật trực tiếp, bypass qua lỗi Schema kẹt biến
        await Car.findByIdAndUpdate(carId, {
            $set: {
                isAvailable: newStatus,
                isAvaliable: newStatus  // Cập nhật cả 2 trường để Frontend đọc kiểu gì cũng trúng
            }
        });

        res.json({ 
            success: true, 
            message: newStatus ? "Phương tiện hiện đã sẵn sàng đón khách" : "Phương tiện đã được tạm ẩn thành công",
            isAvailable: newStatus 
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to Delete Car
export const deleteCar = async (req, res) => {
    try {
        const {_id} = req.user;
        const {carId} = req.body;
        const car = await Car.findById(carId)

        // Checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Không có quyền chỉnh sửa phương tiện này" });
        }

        car.owner = null;
        car.isAvailable = false;
        await car.save();

        res.json({success: true, message: "Xe đã được xóa thành công"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// API to get Dashboard Data 
export const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;

        if (role !== 'owner') {
            return res.json({ success: false, message: "Không có quyền truy cập" });
        }

        // Lấy tất cả dữ liệu một lần thay vì truy vấn nhiều lần vào DB
        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });

        // Sử dụng mảng bookings đã có để lọc, giúp giảm tải cho database
        const pendingBookings = bookings.filter(b => b.status === "Đang chờ xác nhận");
        const completedBookings = bookings.filter(b => b.status === "Đã xác nhận");

        // Tính toán doanh thu chi tiết
        // Tổng doanh thu từ các đơn đã xác nhận (bất kể phương thức thanh toán)
        const monthlyRevenue = completedBookings.reduce((acc, booking) => acc + booking.price, 0);

        // Doanh thu tách riêng theo phương thức thanh toán
        const cashRevenue = completedBookings
            .filter(b => b.paymentMethod === 'Cash')
            .reduce((acc, b) => acc + b.price, 0);

        const vnpayRevenue = completedBookings
            .filter(b => b.paymentMethod === 'VNPAY')
            .reduce((acc, b) => acc + b.price, 0);

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0, 5),
            monthlyRevenue,
            cashRevenue,   // Đã thêm
            vnpayRevenue   // Đã thêm
        };

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to update user image
export const updateUserImage = async (req, res)=>{
    try {
        const { _id } = req.user;

        // FIX: Lấy file từ req.file do Multer xử lý và gán vào biến imageFile
        const imageFile = req.file;

        // Kiểm tra xem người dùng có thực sự upload ảnh lên không
        if (!imageFile) {
            return res.json({ success: false, message: "Không có ảnh nào được tải lên" });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        });

        // optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '400'}, // Width resizing
                {quality: 'auto'}, // Auto compression
                {format: 'webp' } // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;
        await User.findByIdAndUpdate(_id, {image});
        res.json({success: true, message: "Ảnh hồ sơ đã được cập nhật", image})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Thêm vào ownerController.js
export const getOwnerProfile = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Kiểm tra xem ID có đúng định dạng MongoDB không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "ID không hợp lệ" });
        }

        const owner = await User.findById(id).select("-password");
        if (!owner) {
            return res.json({ success: false, message: "Không tìm thấy chủ xe" });
        }
        res.json({ success: true, owner });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};