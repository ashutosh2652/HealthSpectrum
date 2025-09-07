import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        clerkId: { type: String, required: true, unique: true },
        email: { type: String },
        userName: { type: String },
        linkedPatients: [
            {
                type: Schema.Types.ObjectId,
                ref: "Patient",
            },
        ],

        token: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

export const User = model("User", userSchema);
