import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const adminRouter = express.Router();

// Route lấy thống kê (phải đăng nhập và phải là admin)
adminRouter.get('/stats', protect, adminOnly, getAdminStats);

export default adminRouter;