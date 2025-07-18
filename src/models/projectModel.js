// models/Project.js
import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: "" },
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  links: {
    website: String,
    github: String,
    discord: String
  },
  topics: [topicSchema]
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
