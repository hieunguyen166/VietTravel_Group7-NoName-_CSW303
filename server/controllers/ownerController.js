import fs from 'fs';
import imagekit from "../configs/imageKit.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import Booking from "../models/booking.js";

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
    try {
        const {_id} = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file; // Lấy file ảnh từ middleware multer

        // Đọc file ảnh và tải lên ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        });

        // optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '1280'}, // Width resizing
                {quality: 'auto'}, // Auto compression
                {format: 'webp' } // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;
        await Car.create({...car, owner: _id, image});

        res.json({success: true, message: "Xe đã được thêm thành công"})

    }catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
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

        if(role !== 'owner'){
            return res.json({ success: false, message: "Không có quyền truy cập" });
        }

        const cars = await Car.find({owner: _id})
        const bookings = await Booking.find({owner: _id}).populate('car').sort({createdAt: -1});

        // 🛠️ SỬA TẠI ĐÂY: Đổi chuỗi filter sang đúng enum Tiếng Việt trong DB để đếm chính xác
        const pendingBookings = await Booking.find({owner: _id, status: "Đang chờ xác nhận"})
        const completedBookings = await Booking.find({owner: _id, status: "Đã xác nhận"})

        // 🛠️ SỬA TẠI ĐÂY: Đồng bộ bộ lọc tính doanh thu từ các đơn "Đã xác nhận"
        const monthlyRevenue = bookings.slice().filter(booking => booking.status === "Đã xác nhận").reduce((acc, booking) => acc + booking.price, 0);

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0, 5), // Get the 5 most recent bookings
            monthlyRevenue
        }

        res.json({success: true, dashboardData});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

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