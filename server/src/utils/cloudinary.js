import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadonCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        console.log("File has been uploaded successfully!", response.url);
        return response;
    } catch (error) {
        console.log("Error uploading file!!:", error.message);
        return null;
    } finally {
        fs.unlinkSync(localFilePath);
    }
};
const deleteMedia = async ({ publicId, Type }) => {
    try {
        if (!publicId) {
            console.log("PublicId is required!");
            return null;
        }
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: Type,
        });
        console.log("Cloudinary file has been deleted successfully!");
        return result.result;
    } catch (error) {
        console.log(
            "Error while deleting the files from cloudinary!",
            error.message
        );
        return null;
    }
};
const deleteMultipleMedia = async (publicIds) => {
    if (!Array.isArray(publicIds) || publicIds.length == 0)
        throw new ApiError(400, "Invalid PublicIds");
    const deletionPromises = publicIds.map((publicId) => deleteMedia(publicId));
    return Promise.allSettled(deletionPromises);
};
export { uploadonCloudinary, deleteMedia, deleteMultipleMedia };
