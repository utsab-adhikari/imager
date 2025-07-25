
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    uploaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    albumId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album"
    },
     uploader: {
        type: String,
    },
    image: [
        {
            type: String,
        }
    ]
}, { timestamps: true });

const Image = mongoose.models.Image || mongoose.model("Image", imageSchema, "images");

export default Image;
