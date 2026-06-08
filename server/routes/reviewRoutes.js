import express from 'express';
import { addReview, getAllReviews, getCarReviews } from '../controllers/reviewController.js';

const router = express.Router(); // Đang dùng tên biến là 'router'

// SỬA Ở ĐÂY: Dùng 'router' thay vì 'reviewRouter'
router.post('/add', addReview); 
router.get('/car/:id', getCarReviews);
router.get('/all', getAllReviews);
export default router;