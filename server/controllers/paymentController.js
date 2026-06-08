export const createVnpayPayment = async (req, res) => {
    // 1. Cấu hình thông số Sandbox VNPAY (Lấy trên trang VNPAY Sandbox)
    let vnp_TmnCode = "YOUR_TMN_CODE"; 
    let vnp_HashSecret = "YOUR_HASH_SECRET";
    let vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    
    // 2. Tạo URL thanh toán dựa trên số tiền và mã đơn hàng
    // Đơn vị tiền tệ VNPAY thường là VND, bạn phải nhân số tiền với 100
    let amount = req.body.amount * 100; 
    let orderId = req.body.orderId;
    
    // ... Thực hiện hàm sort các params và tạo chuỗi hash (SHA256) ...
    // Trả về cho frontend một URL hoặc data QR code
    res.json({ success: true, paymentUrl: vnpUrl + "?" + queryString });
};