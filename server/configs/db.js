import mongoose from "mongoose";

const connectDB = async () => {

    try {

        const uri =
        "mongodb://hieu166:VietTrav2026@ac-9h8tq9l-shard-00-00.vrvfkct.mongodb.net:27017/VietTrav?ssl=true&authSource=admin&retryWrites=true&w=majority";

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000
        });

        console.log("✅ MongoDB Connected");

        console.log(
            "READY STATE:",
            mongoose.connection.readyState
        );

    } catch (error) {

        console.log("❌", error);

    }
};

export default connectDB;