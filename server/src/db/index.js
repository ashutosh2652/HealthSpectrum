import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isConnected = false;
async function connectdb() {
    if (isConnected) return;
    const options = {
        tls: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5_000,
        socketTimeoutMS: 45_000,
    };
    try {
        await mongoose.connect(process.env.MONGODB_URI, options);
        isConnected = true;
        console.log(`✅  Mongoose connected → ${mongoose.connection.name}`);
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}
async function disconnectdb() {
    if (!isConnected) return;
    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log("Mongoose disconnected successfully!");
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}
export { connectdb, disconnectdb };
