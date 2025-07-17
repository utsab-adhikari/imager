import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    dueDate: Date, // Optional due date/time
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
  },
  { timestamps: true }
);

taskSchema.virtual("subtasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "parent",
  justOne: false,
});

taskSchema.set("toObject", { virtuals: true });
taskSchema.set("toJSON", { virtuals: true });

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;
