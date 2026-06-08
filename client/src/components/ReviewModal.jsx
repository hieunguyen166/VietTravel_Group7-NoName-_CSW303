import { useState } from 'react';

const ReviewModal = ({ isOpen, onClose, bookingId, userId }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const submitReview = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/review/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId, userId, rating, comment })
            });
            
            const data = await response.json();

            if (response.ok) {
                alert("Cảm ơn bạn đã đánh giá!");
                onClose(); // Đóng modal sau khi thành công
            } else {
                alert(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Không thể kết nối đến máy chủ.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <h3>Đánh giá chuyến đi</h3>
            <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
            <textarea placeholder="Nhận xét của bạn..." onChange={(e) => setComment(e.target.value)} />
            <button onClick={submitReview}>Gửi đánh giá</button>
            <button onClick={onClose}>Đóng</button>
        </div>
    );
};
export default ReviewModal;