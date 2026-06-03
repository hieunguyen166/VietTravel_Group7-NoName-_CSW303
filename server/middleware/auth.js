// SỬA LẠI TRONG FILE MIDDLEWARE XÁC THỰC CỦA BẠN (Ví dụ: auth.js hoặc nơi chứa protect)

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        // 1. Kiểm tra và cắt chuỗi Bearer Token từ Postman
        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
        }

        if (!token) {
            return res.json({ success: false, message: "not authorized" });
        }

        // 2. Xác thực chữ ký mã hóa bằng jwt.verify (thay vì jwt.decode)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Trích xuất userId từ Object thu được
        const userId = decoded.userId; 

        if (!userId) {
            return res.json({ success: false, message: "not authorized" });
        }

        // 4. Tìm kiếm người dùng trong Database, loại bỏ password ra để bảo mật
        req.user = await User.findById(userId).select("-password");
        
        if (!req.user) {
            return res.json({ success: false, message: "not authorized" });
        }

        // 5. Cho phép đi tiếp sang hàm getUserData
        next(); 
    } catch (error) {
        console.log("Lỗi xác thực Token:", error.message);
        return res.json({ success: false, message: "not authorized" });
    }
};