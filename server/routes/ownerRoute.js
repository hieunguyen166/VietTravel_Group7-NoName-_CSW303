import express from "express";
import { addCar, changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, getOwnerProfile, toggleCarAvailability, toggleDriveType, updateUserImage } from "../controllers/ownerController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner)
ownerRouter.post("/add-car", protect, upload.single("image"), addCar)
ownerRouter.get("/cars", protect, getOwnerCars)
ownerRouter.post("/toggle-car", protect, toggleCarAvailability)
ownerRouter.post("/delete-car", protect, deleteCar)

ownerRouter.get("/dashboard", protect, getDashboardData)
ownerRouter.post("/update-image", upload.single("image"), protect, updateUserImage)
ownerRouter.get("/details/:id", protect, getOwnerProfile);
ownerRouter.post('/toggle-drive-type', protect, toggleDriveType);
export default ownerRouter;