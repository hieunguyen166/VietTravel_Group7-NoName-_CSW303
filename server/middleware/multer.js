import multer from 'multer';

// Sử dụng Memory Storage cho môi trường Serverless của Vercel
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// HỢP NHẤT CÁCH XUẤT: Sử dụng export default ở đây
export default upload;