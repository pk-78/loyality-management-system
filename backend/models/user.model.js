import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Staff"],
    },
  },
  {
    timeStamps: true,
  }
);

const User = mongoose.model("User",userSchema)

export default User
