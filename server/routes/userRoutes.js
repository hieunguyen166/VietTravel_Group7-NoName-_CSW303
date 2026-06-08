import express from 'express';
import { getCars, getUserData, loginUser, registerUser, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/data', protect, getUserData);
userRoutes.get('/cars', getCars);
// userRoutes.js
// userRoutes.js
userRoutes.put('/update-profile', protect, upload.fields([{ name: 'image' }, { name: 'driverLicense' }]), updateUserProfile);
export default userRoutes;