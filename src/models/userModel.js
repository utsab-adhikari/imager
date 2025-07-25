import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    image: String,
    role: { type: String, enum: ["user", "admin", "demo"], default: "user" },
    badge: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    family: {
      type: String,
      enum: ["member", "visitor", "Family"],
      default: "member",
    },
    contact: {
      type: Number,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
