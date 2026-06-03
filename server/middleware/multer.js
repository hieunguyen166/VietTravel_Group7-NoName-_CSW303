import multer from 'multer';

// Cấu hình nơi lưu và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Bạn cần tạo sẵn thư mục 'uploads' ở thư mục gốc của project server
  },
  filename: function (req, file, cb) {
    // Tạo tên file duy nhất bằng cách kết hợp thời gian hiện tại + tên gốc
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

export default upload;