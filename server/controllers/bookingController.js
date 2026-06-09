import Booking from "../models/booking.js";
import Car from "../models/Car.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

// Function to Check Availability of Car for a given Date
const checkAvailability = async (car, pickupDate, returnDate)=>{
    const bookings = await Booking.find({
        car,
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate},
    })
    return bookings.length === 0;
}

// API to Check Availability of Cars for the given Date and location
export const checkAvailabilityOfCar = async (req, res)=>{
    try {
        const {location, pickupDate, returnDate} = req.body

        // 🛠️ ĐÃ SỬA: 
        // 1. Chuyển sang tìm kiếm theo cột "city" (city: location)
        // 2. Sửa lại đúng chính tả biến "isAvailable"
        const cars = await Car.find({ city: location, isAvailable: true })

        // FIX TẠI ĐÂY: Thêm tham số (car) vào trong arrow function của map
        const availableCarsPromises = cars.map(async (car)=>{ 
            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate)
            return {...car._doc, isAvailable: isAvailable}
        })

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable===true)

        res.json({success: true, availableCars})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
console.log("=== KIỂM TRA IMPORT USER ===", User);
// API to create a booking
export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { car, pickupDate, returnDate, paymentMethod, driveType } = req.body;

        // 1. Phải lấy dữ liệu User trước khi kiểm tra điều kiện
        const userData = await User.findById(_id);
        if (!userData) {
            return res.json({ success: false, message: "Người dùng không tồn tại." });
        }

        const isAvailable = await checkAvailability(car, pickupDate, returnDate);
        if (!isAvailable) {
            return res.json({ success: false, message: "Xe đã được đặt trong khoảng thời gian này." });
        }

        const carData = await Car.findById(car);
        if (!carData) {
            return res.json({ success: false, message: "Xe không tồn tại." });
        }

        if (!carData.driveTypes.includes(driveType)) {
            return res.json({ success: false, message: "Hình thức thuê này không khả dụng cho xe này." });
        }
        
        // 2. Kiểm tra điều kiện CCCD và GPLX
        if (driveType === 'self-drive') {
            if (!userData.identifyCode || !userData.driverLicense) {
                return res.json({ 
                    success: false, 
                    message: "Bạn cần cập nhật đủ CCCD và GPLX để thuê xe tự lái." 
                });
            }
        }

        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
        const price = carData.pricePerDay * noOfDays;

        // 3. Tạo Booking
        const newBooking = await Booking.create({
            car, 
            owner: carData.owner, 
            user: _id, 
            pickupDate, 
            returnDate, 
            price,
            paymentMethod: paymentMethod || 'Cash',
            driveType: driveType, 
            status: paymentMethod === 'VNPAY' ? 'Chờ thanh toán' : 'Đang chờ xác nhận',
            isPaid: false
        });

        res.json({ 
            success: true, 
            message: paymentMethod === 'VNPAY' 
                ? "Đơn hàng đã được tạo. Vui lòng hoàn tất thanh toán!" 
                : "Đặt xe thành công!" 
        });
    } catch (error) {
console.log("=========================================");
        console.log("THỦ PHẠM GÂY LỖI NẰM Ở ĐÂY:");
        console.log(error.stack); // Dòng này BẮT BUỘC phải in ra đầy đủ các dòng "at..."
        console.log("=========================================");
        
        res.json({ success: false, message: error.message });
    }
}

// API to List User's Bookings
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort
        ({createdAt: -1})
        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Owner's Bookings
export const getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.json({ success: false, message: "Không có quyền truy cập" });
        }

        // Lấy danh sách booking và lấy kèm thông tin car + user
        const bookings = await Booking.find({ owner: req.user._id })
            .populate('car') 
            .populate('user', 'name email address phone driverLicense identifyCode') // CHỈ lấy các trường công khai của user
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to change booking status by owner
export const changeBookingStatus = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId, status } = req.body;

        const booking = await Booking.findById(bookingId).populate('car'); // Cần populate car để lấy giá
        if (!booking) return res.json({ success: false, message: "Booking không tồn tại" });

        if (booking.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Không có quyền truy cập" });
        }

        // Cập nhật trạng thái
        booking.status = status;
        await booking.save();

        // 🚀 NẾU ĐƯỢC XÁC NHẬN -> MỚI TẠO ORDER
        if (status === 'Đã xác nhận') {
            const adminCommission = booking.price * 0.05;
            const ownerAmount = booking.price * 0.95;

            await Order.create({
                bookingId: booking._id,
                userId: booking.user,
                carId: booking.car._id,
                totalAmount: booking.price,
                adminCommission: adminCommission,
                ownerAmount: ownerAmount,
                paymentStatus: 'paid' // Hoặc trạng thái thu tiền thực tế
            });
        }

        res.json({ success: true, message: "Trạng thái đã được cập nhật thành công và hoa hồng đã được ghi nhận!" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to generate Fake VNPAY QR
export const generateVnpayQR = async (req, res) => {
    try {
        const { amount, orderId } = req.body;
        // Đây là URL ảnh QR code giả lập, bạn có thể thay bằng link ảnh thật
        const qrImageUrl = `https://api.vietqr.io/image/970415-0000000000-qRz5vYk.jpg?amount=${amount}&addInfo=ThanhToanDonHang${orderId}`;
        
        res.json({ 
            success: true, 
            qrCode: qrImageUrl,
            message: "Vui lòng quét mã để thanh toán" 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Thêm API này vào bookingController.js
export const getUserBookingHistory = async (req, res) => {
    try {
        // Lấy ID từ user đã được xác thực bởi middleware 'protect'
        const userId = req.params.userId; 

        const history = await Booking.find({ user: userId })
            .populate('car', 'brand model image')
            .sort({ createdAt: -1 });

        res.json({ success: true, history });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to get all booked dates for a specific car
export const getBookedDates = async (req, res) => {
    try {
        console.log("Đã nhận request cho xe:", req.params.carId);
        const { carId } = req.params;
        
        // Kiểm tra xem ID có hợp lệ không
        if (!carId) return res.status(400).json({ success: false, message: "Thiếu ID xe" });

        const bookings = await Booking.find({ 
            car: carId, 
            status: { $ne: 'Đã hủy' } 
        });
        
        const bookedIntervals = bookings.map(b => ({
            start: b.pickupDate,
            end: b.returnDate
        }));
        
        res.json({ success: true, bookedIntervals });
    } catch (error) {
        console.error("LỖI DB:", error); // Log lỗi cụ thể ra terminal
        res.status(500).json({ success: false, message: error.message });
    }
}