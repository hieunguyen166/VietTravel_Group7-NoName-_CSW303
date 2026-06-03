import Booking from "../models/booking.js";
import Car from "../models/Car.js";


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

        // fetch all available cars for the given location
        const cars = await Car.find({location, isAvaliable: true})

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

// API to create a booking
export const createBooking = async (req, res)=>{
    try {
        const { _id } = req.user;
        const { car, pickupDate, returnDate } = req.body;

        const isAvailable = await checkAvailability(car, pickupDate, returnDate)
            if(!isAvailable){
                return res.json({success: false, message: "Xe đã được đặt trong khoảng thời gian này. Vui lòng chọn ngày khác hoặc xe khác."})
            }

        const carData = await Car.findById(car)
        
        // 🛠️ FIX TẠI ĐÂY: Kiểm tra nếu xe cũ trong DB không có trường owner thì báo lỗi ngay lập tức
        if (!carData || !carData.owner) {
            return res.json({success: false, message: "Thông tin chủ xe không tồn tại. Vui lòng thử lại với xe khác."})
        }

        // Calculate price based on Pickup and Return Date
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
        const price = carData.pricePerDay * noOfDays;

        await Booking.create({car, owner: carData.owner, user: _id, pickupDate, returnDate, price});
        res.json({success: true, message: "Đặt xe thành công! Bạn có thể xem chi tiết đặt xe trong mục 'Đơn hàng của tôi'."})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
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
export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({ success: false, message: "Không có quyền truy cập" })
        }
        const bookings = await Booking.find({owner: req.user._id}).populate
        ('car user').select("-user.password").sort({createdAt: -1 })
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to change booking status by owner
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body

        const booking = await Booking.findById(bookingId)

        if(booking.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Không có quyền truy cập" })
        }

        booking.status = status;
        await booking.save();
        res.json({success: true, message: "Trạng thái đã được cập nhật thành công"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}