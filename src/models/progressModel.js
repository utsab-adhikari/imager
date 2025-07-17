import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    content: [{ type: String }], // bullet points
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Progress =
  mongoose.models.Progress || mongoose.model("Progress", progressSchema);

export default Progress;
