import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
    },
    linkedPatients: [{
      type: Schema.Types.ObjectId,
      ref: 'Patient',
    }],
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
