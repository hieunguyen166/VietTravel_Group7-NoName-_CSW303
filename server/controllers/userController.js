import bcrypt from "bcryptjs";
import ImageKit from "imagekit";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import connectDB from "../configs/db.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});
// Generate JWT Token
const generateToken = (userId) => {
    const payload = { userId: userId }; // Bọc payload dạng Object để JWT hoạt động chuẩn xác và bảo mật
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export const registerUser = async (req, res)=>{

    console.log("REGISTER API HIT");
    console.log("readyState =", mongoose.connection.readyState);
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password || password.length < 8){
            return res.json({success: false, message: 'Fill all the fields'})
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        // 👇 FIX: Thêm lệnh lưu người dùng vào Database MongoDB
        await newUser.save(); 

        // 👇 FIX: Đổi từ 'user._id' thành 'newUser._id' theo đúng tên biến bạn đã khai báo ở trên
        const token = generateToken(newUser._id.toString()) 
        
        res.json({success: true, token})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// Login user
export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials" })
        }
        const token = generateToken(user._id.toString())
        res.json({success: true, token})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get user data using token (JWT)
export const getUserData = async (req, res) =>{
    try {
        const {user} = req;
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get All Cars for the frontend
export const getCars = async (req, res) => {
    try {
        await connectDB();

        // 1. Lấy các tham số tìm kiếm từ URL (Frontend gửi lên)
        const { driveType, pickupLocation } = req.query;

        // 2. Tạo đối tượng bộ lọc mặc định (Chỉ lấy xe đang rảnh)
        let filter = { isAvailable: true };

        // 3. Gắn thêm điều kiện lọc nếu Frontend có truyền lên
        if (driveType) {
            filter.driveType = driveType;
        }
        
        if (pickupLocation) {
            // Nếu dùng pickupLocation mapping với trường 'city' trong DB
            filter.city = pickupLocation; 
        }

        // 4. Tìm xe theo bộ lọc đã tạo
        const cars = await Car.find(filter).populate('owner', 'name phone email');

        res.json({
            success: true,
            cars
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: error.message
        });
    }
}

// 🆕 HÀM MỚI: Tùy chỉnh thông tin cá nhân (Dành cho cả User lẫn Owner)
// 🚀 ĐỔI TÊN TỪ updateProfile THÀNH updateUserProfile Ở ĐÂY:
export const updateUserProfile = async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await User.findById(_id);
        
        if (!user) return res.json({ success: false, message: "User not found" });

        // Cập nhật thông tin
        if (req.body.name) user.name = req.body.name;
        if (req.body.age) user.age = Number(req.body.age);
        if (req.body.address) user.address = req.body.address;
        if (req.body.phone !== undefined) {
            user.phone = req.body.phone;
            user.markModified('phone');
        }

        // Xử lý ảnh bằng Buffer thay vì lưu xuống ổ cứng
        if (req.files) {
            if (req.files['image']?.[0]) {
                const response = await imagekit.upload({
                    // Dùng trực tiếp buffer dạng string base64 để ImageKit dễ đọc nhất
                    file: req.files['image'][0].buffer.toString('base64'), 
                    fileName: req.files['image'][0].originalname,
                    folder: '/users'
                });
                user.image = response.url;
            }
            if (req.files['driverLicense']?.[0]) {
                const response = await imagekit.upload({
                    file: req.files['driverLicense'][0].buffer.toString('base64'),
                    fileName: req.files['driverLicense'][0].originalname,
                    folder: '/users'
                });
                user.driverLicense = response.url;
            }
        }

        await user.save(); 
        
        return res.json({ success: true, message: "Cập nhật thành công", user: user });
        
    } catch (error) {
        console.log("LỖI CHI TIẾT:", error);
        return res.json({ success: false, message: error.message });
    }
};