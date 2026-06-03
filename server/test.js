import mongoose from "mongoose";

const uri =
"mongodb://hieu166:VietTrav2026@ac-9h8tq9l-shard-00-00.vrvfkct.mongodb.net:27017,ac-9h8tq9l-shard-00-01.vrvfkct.mongodb.net:27017,ac-9h8tq9l-shard-00-02.vrvfkct.mongodb.net:27017/VietTrav?ssl=true&replicaSet=atlas-7i96ql-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000
})
.then(() => {
    console.log("CONNECTED");
    process.exit();
})
.catch((err) => {
    console.log(err);
});