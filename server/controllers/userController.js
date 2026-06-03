import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Car from "../models/Car.js";
import User from "../models/User.js";

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
export const getCars = async (req, res) =>{
    try {
        const cars = await Car.find({isAvaliable: true})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}